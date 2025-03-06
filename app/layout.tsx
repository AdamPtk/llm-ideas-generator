import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Ideas Generator",
  description: "Generate ideas using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${inter.variable} font-sans`}>
        <body className={`min-h-screen bg-background text-foreground antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">
                <div className="container py-6 md:py-10">{children}</div>
              </div>
              <div className="absolute top-0 -z-10 h-full w-full">
                <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-primary/10 blur-2xl md:h-64 md:w-64"></div>
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
