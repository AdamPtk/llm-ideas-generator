"use client";

import { ClerkLoading, ClerkLoaded, SignedOut, SignInButton, SignedIn } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

import { UserProfile } from "./UserProfile";
import { Button } from "./ui/button";
export const Header = () => {
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
    </nav>
  );
};
