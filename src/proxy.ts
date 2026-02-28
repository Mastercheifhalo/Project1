import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role;
    const userStatus = req.auth?.user?.status;

    console.log(`[Proxy] Path: ${nextUrl.pathname} | LoggedIn: ${isLoggedIn} | Role: ${userRole} | Status: ${userStatus}`);

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicRoute = ["/", "/login", "/register", "/api/register"].includes(nextUrl.pathname);
    const isAdminRoute = nextUrl.pathname.startsWith("/admin");

    if (isApiAuthRoute) {
        return NextResponse.next();
    }

    if (isPublicRoute) {
        if (isLoggedIn && nextUrl.pathname !== "/api/register") {
            const redirectUrl = userRole === "ADMIN" ? "/admin" : "/dashboard";
            console.log(`[Proxy] Redirecting logged in ${userRole} from public route to ${redirectUrl}`);
            return NextResponse.redirect(new URL(redirectUrl, nextUrl));
        }
        return NextResponse.next();
    }

    if (!isLoggedIn) {
        console.log(`[Proxy] Redirecting unauthenticated user to /login`);
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    // Zero-Trust: Block suspended users from everything EXCEPT public routes (handled above)
    if (userStatus === "SUSPENDED") {
        console.log(`[Proxy] Blocking suspended user: ${req.auth?.user?.email}`);
        const response = NextResponse.redirect(new URL("/login?error=suspended", nextUrl));
        return response;
    }

    // Admin protection
    if (isAdminRoute) {
        if (userRole !== "ADMIN") {
            console.log(`[Proxy] Denying non-admin access to admin route. Redirecting to /dashboard`);
            return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
        console.log(`[Proxy] Allowing admin access to ${nextUrl.pathname}`);
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
