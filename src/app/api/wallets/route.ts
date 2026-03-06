import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/wallets
 * Returns crypto wallet addresses.
 * Priority: DB (SiteSetting) → process.env fallback
 */
export async function GET() {
    // 1. Try to load from database (admin-configurable)
    const dbSettings = await prisma.siteSetting.findMany({
        where: { key: { in: ['WALLET_BTC', 'WALLET_USDT', 'WALLET_USDC'] } },
    }).catch(() => []);

    const dbMap: Record<string, string> = {};
    for (const s of dbSettings) dbMap[s.key] = s.value;

    // 2. Merge DB values with env fallback
    const wallets: Record<string, string | undefined> = {
        BTC: dbMap['WALLET_BTC'] || process.env.WALLET_BTC,
        USDT: dbMap['WALLET_USDT'] || process.env.WALLET_USDT,
        USDC: dbMap['WALLET_USDC'] || process.env.WALLET_USDC,
    };

    // 3. Check all addresses are present
    const missing = Object.entries(wallets)
        .filter(([, v]) => !v)
        .map(([k]) => k);

    if (missing.length > 0) {
        console.error(`[WALLETS] Missing addresses for: ${missing.join(', ')}`);
        return NextResponse.json(
            { error: 'Payment configuration unavailable. Please contact support.' },
            { status: 503 }
        );
    }

    return NextResponse.json(wallets);
}
