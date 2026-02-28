import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/layout/NavigationWrapper";
import LivelyBackground from "@/components/common/LivelyBackground";
import { AuthProvider } from "@/components/providers/AuthProvider";
import CookieConsent from "@/components/common/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://coursepro.dev"),
  title: "CoursePro — Master Modern Development",
  description: "Practical, expert-led courses for builders. Learn React, Next.js, TypeScript and more. Subscribe for full access or buy individual courses with lifetime ownership.",
  keywords: ["online courses", "web development", "React", "Next.js", "TypeScript", "programming", "coding"],
  authors: [{ name: "CoursePro" }],
  openGraph: {
    title: "CoursePro — Master Modern Development",
    description: "Practical, expert-led courses for builders. Subscribe for full access or buy individual courses with lifetime ownership.",
    url: "https://coursepro.dev",
    siteName: "CoursePro",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CoursePro — Master Modern Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CoursePro — Master Modern Development",
    description: "Practical, expert-led courses for builders.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <AuthProvider>
          <LivelyBackground />
          <NavbarWrapper />
          {children}
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
