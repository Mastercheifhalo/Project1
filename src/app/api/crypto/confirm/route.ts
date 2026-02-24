import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

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
        const { type, plan, coin, courseId } = body;
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

        console.log(
            `[CRYPTO PAYMENT CREATED] User: ${userId} | ID: ${payment.id} | ` +
            `Type: ${type} | Plan: ${plan} | Price: $${price} | Coin: ${coin}`
        );

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
