import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    // Auth guard — only authenticated users can confirm a payment
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, message: 'Unauthorized. Please log in to confirm a payment.' },
            { status: 401 }
        );
    }

    try {
        const userId = session.user.id;
        const body = await request.json();
        const { type, plan, coin, courseId, screenshot } = body;
        let { price } = body; // We'll overwrite this with server-side truth

        if (!coin || (!plan && type !== 'course')) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields: coin, and either plan or courseId.' },
                { status: 400 }
            );
        }

        // ─── Server-Side Price Verification ───────────────────────────────────
        if (type === 'course') {
            if (!courseId) return NextResponse.json({ success: false, message: 'courseId required' }, { status: 400 });
            const course = await prisma.course.findUnique({ where: { id: courseId }, select: { price: true } });
            if (!course) return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 });
            price = course.price.toString();
        } else {
            // Subscription prices from source of truth
            const PRICES: Record<string, string> = {
                'Monthly': '29',
                'Quarterly': '79',
                'Annual': '249'
            };
            if (!plan || !PRICES[plan]) return NextResponse.json({ success: false, message: 'Invalid plan' }, { status: 400 });
            price = PRICES[plan];
        }

        const validCoins = ['BTC', 'USDT', 'USDC'];
        if (!validCoins.includes(coin)) {
            return NextResponse.json(
                { success: false, message: 'Invalid coin selection.' },
                { status: 400 }
            );
        }

        // ─── Handle Screenshot ───────────────────────────────────────────────
        let screenshotPath = null;
        if (screenshot) {
            try {
                // Ensure directory exists
                const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'payments');
                await fs.mkdir(uploadDir, { recursive: true });

                // Process base64
                const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, "");
                const fileName = `proof_${Date.now()}_${uuidv4().slice(0, 8)}.png`;
                const filePath = path.join(uploadDir, fileName);

                await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'));
                screenshotPath = `/uploads/payments/${fileName}`;
            } catch (err) {
                console.error("Screenshot save failed:", err);
                // We keep going, but log the error
            }
        }

        // Create Payment record
        const payment = await prisma.payment.create({
            data: {
                userId,
                amount: parseFloat(price),
                currency: 'USD',
                method: 'CRYPTO',
                coin,
                plan: type === 'course' ? 'OneTime' : plan,
                status: 'PENDING',
                courseId: type === 'course' ? courseId : null,
                screenshot: screenshotPath,
            },
        });

        // Grant access (Manual verification, but we'll create the record now)
        if (type === 'course' && courseId) {
            await prisma.enrollment.upsert({
                where: { userId_courseId: { userId, courseId } },
                update: { status: 'PENDING' },
                create: { userId, courseId, status: 'PENDING' },
            });
        } else if (type === 'subscription' && plan) {
            const now = new Date();
            const endDate = new Date();
            if (plan === 'Monthly') endDate.setMonth(now.getMonth() + 1);
            else if (plan === 'Quarterly') endDate.setMonth(now.getMonth() + 3);
            else if (plan === 'Annual') endDate.setFullYear(now.getFullYear() + 1);

            await prisma.subscription.create({
                data: {
                    userId,
                    plan,
                    status: 'PENDING',
                    startDate: now,
                    endDate,
                },
            });
        }

        // Payment record is created in DB — no need to log PII to server output

        return NextResponse.json({
            success: true,
            message: 'Payment and access records created. Verification pending.',
        });
    } catch (error) {
        console.error('[CRYPTO CONFIRM ERROR]', error);
        return NextResponse.json(
            { success: false, message: 'Failed to log payment attempt.' },
            { status: 500 }
        );
    }
}
