"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

interface FeatureGateProps {
  feature: "aiChatEnabled" | "unlimitedReports";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { canAccessFeature, plan } = useSubscription();

  if (canAccessFeature(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Default upgrade prompt
  return (
    <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/5">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-lg">
          {feature === "aiChatEnabled" ? "AI Chat Feature" : "Unlimited Reports"}
        </CardTitle>
        <CardDescription>
          {feature === "aiChatEnabled"
            ? "Chat with your reports using AI to get deeper insights and analysis."
            : "Generate unlimited SEO reports every month."}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Badge className="mb-4 bg-gradient-to-r from-primary to-accent text-primary-foreground">
          <Sparkles className="w-3 h-3 mr-1" />
          Pro Feature
        </Badge>
        <p className="text-sm text-muted-foreground mb-6">
          {plan === "free" 
            ? "Upgrade to Pro to unlock this powerful feature and accelerate your SEO workflow."
            : "Upgrade from Starter to Pro to unlock AI-powered insights."}
        </p>
        <Link href="/pricing">
          <Button className="w-full" size="lg">
            <Zap className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

interface ReportLimitGateProps {
  currentReportsCount: number;
  children: React.ReactNode;
}

export function ReportLimitGate({ currentReportsCount, children }: ReportLimitGateProps) {
  const { canGenerateReport, getRemainingReports, plan, features } = useSubscription();

  if (canGenerateReport(currentReportsCount)) {
    return <>{children}</>;
  }

  const remainingReports = getRemainingReports(currentReportsCount);

  return (
    <Card className="border-2 border-dashed border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <CardTitle className="text-lg text-orange-900 dark:text-orange-100">
          Report Limit Reached
        </CardTitle>
        <CardDescription className="text-orange-700 dark:text-orange-300">
          You've used all {features.reportsPerMonth} reports for this month.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-orange-700 dark:text-orange-300 mb-6">
          {plan === "starter" 
            ? "Upgrade to Pro for unlimited reports or wait until next month."
            : "Subscribe to get started with SEO reports."}
        </p>
        <div className="space-y-2">
          <Link href="/pricing">
            <Button className="w-full" size="lg">
              <Zap className="w-4 h-4 mr-2" />
              {plan === "starter" ? "Upgrade to Pro" : "Choose a Plan"}
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground">
            {plan === "starter" && "Your reports reset at the beginning of each month"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}