"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { UserButton, SignInButton } from "@clerk/nextjs";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { ThemeToggle } from "./ThemeToggle";

function Header() {
  return (
    <header className="sticky top-0 z-0 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4">
        <div className="flex flex-1 items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex size-6 items-center justify-center rounded-md bg-foreground text-background">
              B
            </span>
            <span className="text-sm font-semibold tracking-tight">Bright</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-1">
          <ThemeToggle />

          <AuthLoading>
            <Button variant="outline">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
              <span className="sr-only">Loading...</span>
            </Button>
          </AuthLoading>

          <Unauthenticated>
            <SignInButton mode="modal">
              <Button variant="outline">
                <LogIn className="size-4" />
                <span className="sr-only md:not-sr-only md:ml-2">Sign in</span>
              </Button>
            </SignInButton>
          </Unauthenticated>

          <Authenticated>
            <Button variant="ghost">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "size-8",
                  },
                }}
              />
            </Button>
          </Authenticated>
        </div>
      </div>
    </header>
  );
}

export default Header;
