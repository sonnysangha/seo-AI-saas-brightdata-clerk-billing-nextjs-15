"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function SubscriptionInitializer({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const initializeSubscription = useMutation(api.subscriptions.initializeUserSubscription);

  useEffect(() => {
    if (isLoaded && user) {
      // Initialize subscription for the user if they don't have one
      initializeSubscription({ userId: user.id }).catch((error) => {
        // Ignore errors - subscription might already exist
        console.log("Subscription initialization:", error.message);
      });
    }
  }, [isLoaded, user, initializeSubscription]);

  return <>{children}</>;
}