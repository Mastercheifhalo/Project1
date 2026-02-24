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
            const isSuspended = auth?.user?.status === "SUSPENDED";
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");

            if (isSuspended) {
                console.log(`[Auth] Blocking suspended user: ${auth?.user?.email}`);
                return false; // Deny access
            }

            if (isOnAdmin) {
                if (isLoggedIn && auth.user.role === "ADMIN") return true;
                return false; // Redirect to login
            }
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as string;
                token.role = user.role as string;
                token.status = user.status as string;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.status = token.status;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;
