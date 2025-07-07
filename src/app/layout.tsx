import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from '@clerk/nextjs'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibe – AI Website Builder",
  description:
    "Vibe is your AI-powered web development partner. Instantly generate responsive, modern websites with clean code using natural language prompts. Built for developers, startups, and creators.",
  keywords: [
    "AI website builder",
    "code generation",
    "Next.js AI",
    "developer tools",
    "frontend generator",
    "instant web design",
    "E2B AI",
    "Inngest",
    "AI developer assistant",
  ],
  metadataBase: new URL("https://vibe-tau-lemon.vercel.app/"),
  openGraph: {
    title: "Vibe – AI Website Builder",
    description:
      "Generate websites instantly with AI. Vibe turns your prompts into production-ready code. Try now!",
    url: "https://vibe-tau-lemon.vercel.app",
    siteName: "Vibe",
    images: [
      {
        url: "https://vibe-tau-lemon.vercel.app/vibe.svg",
        width: 1200,
        height: 630,
        alt: "Vibe AI – Instant Website Generator",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe – AI Website Builder",
    description:
      "Create stunning websites from text prompts with Vibe's powerful AI engine.",
    images: ["https://vibe-tau-lemon.vercel.app/vibe.svg"],
  },
  icons: {
    icon: "/vibe.svg",
    shortcut: "/vibe.svg",
    apple: "/vibe.svg",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#C96342'
        }
      }}
    >
      <TRPCReactProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider
              attribute={'class'}
              defaultTheme="system"
              disableTransitionOnChange
              enableSystem
            >
              <Toaster />
              {children}
            </ThemeProvider>

          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
