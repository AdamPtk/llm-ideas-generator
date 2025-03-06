"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClerkLoading, ClerkLoaded, SignedOut, SignInButton, SignedIn } from "@clerk/nextjs";
import { Loader2, Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";

import { UserProfile } from "./user-profile";
import { Button } from "./ui/button";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2 transition-all hover:opacity-80">
          <div className="relative">
            <Sparkles className="size-6 text-primary" />
          </div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-[hsl(var(--chart-2))]">
            Ideas Generator
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <ClerkLoading>
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="hover:bg-primary/5">
                  Sign in
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserProfile />
            </SignedIn>
          </ClerkLoaded>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 hover:bg-primary/5"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
