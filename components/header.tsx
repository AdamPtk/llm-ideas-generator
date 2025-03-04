"use client";

import { useEffect, useState } from "react";
import { ClerkLoading, ClerkLoaded, SignedOut, SignInButton, SignedIn } from "@clerk/nextjs";
import { Loader2, Moon, Sun } from "lucide-react";
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
    <nav className="flex justify-end items-center p-4">
      <ClerkLoading>
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" size="sm">
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
          className="ml-4"
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      )}
    </nav>
  );
};
