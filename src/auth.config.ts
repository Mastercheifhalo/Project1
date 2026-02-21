import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    providers: [
        // Providers are added in the main auth.ts to avoid DB dependency in middleware
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");

            if (isOnAdmin) {
                if (isLoggedIn && (auth.user as any).role === "ADMIN") return true;
                return false; // Redirect to login
            }
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
