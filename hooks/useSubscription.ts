"use client";

import { useUser } from "@clerk/nextjs";
import { useMemo } from "react";

export type SubscriptionPlan = "starter" | "pro" | "free";

export interface SubscriptionFeatures {
  reportsPerMonth: number;
  aiChatEnabled: boolean;
  unlimitedReports: boolean;
}

export const PLAN_FEATURES: Record<SubscriptionPlan, SubscriptionFeatures> = {
  free: {
    reportsPerMonth: 0,
    aiChatEnabled: false,
    unlimitedReports: false,
  },
  starter: {
    reportsPerMonth: 10,
    aiChatEnabled: false,
    unlimitedReports: false,
  },
  pro: {
    reportsPerMonth: -1, // -1 means unlimited
    aiChatEnabled: true,
    unlimitedReports: true,
  },
};

/**
 * Hook to get user's subscription information
 */
export function useSubscription() {
  const { user, isLoaded } = useUser();

  const subscription = useMemo(() => {
    if (!isLoaded || !user) {
      return {
        plan: "free" as SubscriptionPlan,
        features: PLAN_FEATURES.free,
        isLoaded: false,
      };
    }

    // Get subscription info from Clerk's public metadata
    const metadata = user.publicMetadata as any;
    const subscriptionStatus = metadata?.subscriptionStatus;
    const planType = metadata?.planType;

    let plan: SubscriptionPlan = "free";
    
    // If user has an active subscription
    if (subscriptionStatus === "active") {
      plan = planType === "pro" ? "pro" : "starter";
    }

    return {
      plan,
      features: PLAN_FEATURES[plan],
      isLoaded: true,
    };
  }, [user, isLoaded]);

  return {
    ...subscription,
    canAccessFeature: (feature: keyof SubscriptionFeatures) => {
      return subscription.features[feature] as boolean;
    },
    canGenerateReport: (currentReportsCount: number) => {
      if (subscription.features.unlimitedReports) {
        return true;
      }
      return currentReportsCount < subscription.features.reportsPerMonth;
    },
    getRemainingReports: (currentReportsCount: number) => {
      if (subscription.features.unlimitedReports) {
        return -1; // Unlimited
      }
      return Math.max(0, subscription.features.reportsPerMonth - currentReportsCount);
    },
  };
}