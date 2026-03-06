import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

const WALLET_KEYS = ['WALLET_BTC', 'WALLET_USDT', 'WALLET_USDC'] as const;

/**
 * POST /api/admin/wallets
 * Admin-only: update crypto wallet addresses in the database.
 */
export async function POST(req: NextRequest) {
    // 1. Auth & Admin Authorization Check
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { BTC, USDT, USDC } = body;

        const updates: Record<string, string> = {};
        if (BTC !== undefined) updates['WALLET_BTC'] = BTC;
        if (USDT !== undefined) updates['WALLET_USDT'] = USDT;
        if (USDC !== undefined) updates['WALLET_USDC'] = USDC;

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: 'No addresses provided' }, { status: 400 });
        }

        // Upsert each wallet address in SiteSetting
        await Promise.all(
            Object.entries(updates).map(([key, value]) =>
                prisma.siteSetting.upsert({
                    where: { key },
                    update: { value },
                    create: { key, value },
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[Wallet Update Error]:', error);
        return NextResponse.json({ error: 'Failed to update wallet addresses' }, { status: 500 });
    }
}
