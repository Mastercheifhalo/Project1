import { NextResponse } from 'next/server';

/**
 * GET /api/wallets
 * Returns crypto wallet addresses from server-side environment variables.
 * Addresses are never shipped in the client bundle.
 */
export async function GET() {
    const wallets: Record<string, string | undefined> = {
        BTC: process.env.WALLET_BTC,
        USDT: process.env.WALLET_USDT,
        USDC: process.env.WALLET_USDC,
    };

    // Ensure all wallets are configured
    const missing = Object.entries(wallets)
        .filter(([, v]) => !v)
        .map(([k]) => k);

    if (missing.length > 0) {
        console.error(`[WALLETS] Missing env vars for: ${missing.join(', ')}`);
        return NextResponse.json(
            { error: 'Payment configuration unavailable. Please contact support.' },
            { status: 503 }
        );
    }

    return NextResponse.json(wallets);
}
