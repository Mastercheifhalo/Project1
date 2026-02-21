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
        const { type, plan, price, coin, courseId } = body;

        if (!price || !coin || (!plan && type !== 'course')) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields: price, coin, and either plan or courseId.' },
                { status: 400 }
            );
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
                plan, // "OneTime" | "Monthly" | "Quarterly" | "Annual"
                status: 'PENDING',
                courseId: type === 'course' ? courseId : null,
            },
        });

        // Grant access (Manual verification, but we'll create the record now)
        if (type === 'course' && courseId) {
            await prisma.enrollment.upsert({
                where: { userId_courseId: { userId, courseId } },
                update: { status: 'ACTIVE' },
                create: { userId, courseId, status: 'ACTIVE' },
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
                    status: 'ACTIVE',
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
