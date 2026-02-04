import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { plan, price, coin } = body;

        // Log the payment attempt for manual verification
        console.log(`[CRYPTO PAYMENT ATTEMPT] Plan: ${plan}, Price: ${price}, Coin: ${coin}, Timestamp: ${new Date().toISOString()}`);

        return NextResponse.json({
            success: true,
            message: "Payment attempt logged. Manual verification in progress."
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to log payment attempt."
        }, { status: 500 });
    }
}
