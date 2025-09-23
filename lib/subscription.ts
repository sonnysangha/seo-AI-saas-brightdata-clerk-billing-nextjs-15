import { auth } from "@clerk/nextjs/server";

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
 * Get the user's current subscription plan from Clerk
 */
export async function getUserSubscriptionPlan(): Promise<SubscriptionPlan> {
  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    return "free";
  }

  // Check Clerk's public metadata for subscription info
  const metadata = sessionClaims?.metadata as any;
  const subscriptionStatus = metadata?.subscriptionStatus;
  const planType = metadata?.planType;

  // If user has an active subscription
  if (subscriptionStatus === "active") {
    return planType === "pro" ? "pro" : "starter";
  }

  return "free";
}

/**
 * Check if user can access a specific feature
 */
export async function canAccessFeature(feature: keyof SubscriptionFeatures): Promise<boolean> {
  const plan = await getUserSubscriptionPlan();
  const features = PLAN_FEATURES[plan];
  return features[feature] as boolean;
}

/**
 * Check if user can generate more reports
 */
export async function canGenerateReport(currentReportsCount: number): Promise<boolean> {
  const plan = await getUserSubscriptionPlan();
  const features = PLAN_FEATURES[plan];
  
  if (features.unlimitedReports) {
    return true;
  }
  
  return currentReportsCount < features.reportsPerMonth;
}

/**
 * Get remaining reports for the current month
 */
export async function getRemainingReports(currentReportsCount: number): Promise<number> {
  const plan = await getUserSubscriptionPlan();
  const features = PLAN_FEATURES[plan];
  
  if (features.unlimitedReports) {
    return -1; // Unlimited
  }
  
  return Math.max(0, features.reportsPerMonth - currentReportsCount);
}