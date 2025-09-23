"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useSubscription } from "@/hooks/useSubscription";

export function TestFeatureGating() {
  const { user } = useUser();
  const { plan, features, isLoaded } = useSubscription();
  const createTestSubscription = useMutation(api.testSubscriptions.createTestSubscriptions);

  if (!user || !isLoaded) {
    return null;
  }

  const handleSetPlan = async (newPlan: "free" | "starter" | "pro") => {
    await createTestSubscription({
      userId: user.id,
      plan: newPlan,
    });
    // Refresh the page to see changes
    window.location.reload();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>🧪 Test Feature Gating</CardTitle>
        <CardDescription>
          Current Plan: <strong>{plan}</strong> | Reports: {features.reportsPerMonth === -1 ? "Unlimited" : features.reportsPerMonth} | AI Chat: {features.aiChatEnabled ? "✅" : "❌"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button 
            variant={plan === "free" ? "default" : "outline"} 
            size="sm"
            onClick={() => handleSetPlan("free")}
          >
            Set Free
          </Button>
          <Button 
            variant={plan === "starter" ? "default" : "outline"} 
            size="sm"
            onClick={() => handleSetPlan("starter")}
          >
            Set Starter
          </Button>
          <Button 
            variant={plan === "pro" ? "default" : "outline"} 
            size="sm"
            onClick={() => handleSetPlan("pro")}
          >
            Set Pro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}