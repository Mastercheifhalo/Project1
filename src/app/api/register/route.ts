import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Simple email regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name } = body;

        // ── Presence checks ──────────────────────────────────────────
        if (!email || !password || !name) {
            return new NextResponse("Missing name, email, or password", { status: 400 });
        }

        // ── Name validation ──────────────────────────────────────────
        const trimmedName = String(name).trim();
        if (trimmedName.length < 2) {
            return new NextResponse("Name must be at least 2 characters", { status: 400 });
        }
        if (trimmedName.length > 80) {
            return new NextResponse("Name must be 80 characters or fewer", { status: 400 });
        }

        // ── Email validation ─────────────────────────────────────────
        const trimmedEmail = String(email).trim().toLowerCase();
        if (!EMAIL_REGEX.test(trimmedEmail)) {
            return new NextResponse("Invalid email address", { status: 400 });
        }
        if (trimmedEmail.length > 255) {
            return new NextResponse("Email address is too long", { status: 400 });
        }

        // ── Password validation ───────────────────────────────────────
        const pwd = String(password);
        if (pwd.length < 8) {
            return new NextResponse("Password must be at least 8 characters", { status: 400 });
        }
        if (pwd.length > 128) {
            return new NextResponse("Password must be 128 characters or fewer", { status: 400 });
        }

        // ── Duplicate check ───────────────────────────────────────────
        const userExists = await prisma.user.findUnique({ where: { email: trimmedEmail } });
        if (userExists) {
            return new NextResponse("An account with this email already exists", { status: 400 });
        }

        // ── Create user ───────────────────────────────────────────────
        const hashedPassword = await bcrypt.hash(pwd, 12); // cost factor 12

        const user = await prisma.user.create({
            data: {
                email: trimmedEmail,
                name: trimmedName,
                password: hashedPassword,
                role: "STUDENT",
            },
        });

        // Exclude password hash from response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _pw, ...safeUser } = user;
        return NextResponse.json(safeUser, { status: 201 });

    } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        console.error("REGISTRATION_ERROR:", err);
        return new NextResponse(
            `Internal Server Error: ${err.message ?? "Unknown error"}`,
            { status: 500 }
        );
    }
}
