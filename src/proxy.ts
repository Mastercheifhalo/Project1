import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicRoute = ["/", "/login", "/register", "/api/register"].includes(nextUrl.pathname);
    const isAdminRoute = nextUrl.pathname.startsWith("/admin");

    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    if (isPublicRoute) {
        if (isLoggedIn && nextUrl.pathname !== "/api/register") {
            return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
        return NextResponse.next();
    }

    if (!isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    // Admin protection
    if (isAdminRoute && (req.auth?.user as any)?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
