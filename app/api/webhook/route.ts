import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { headers } from "next/headers";
import { Webhook } from "svix";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const POST = async (req: Request) => {
  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId");

  // Handle Bright Data webhook (existing functionality)
  if (jobId) {
    try {
      const data = await req.json();
      console.log("Bright Data webhook data:", data);

      // Update the job with results
      if (data && data.length > 0) {
        await convex.mutation(api.scrapingJobs.completeJob, {
          jobId: jobId as any,
          results: data,
        });
      }

      return new Response("OK");
    } catch (error) {
      console.error("Error processing Bright Data webhook:", error);
      return new Response("Error processing webhook", { status: 500 });
    }
  }

  // Handle Clerk billing webhooks
  try {
    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Error occurred -- no svix headers", { status: 400 });
    }

    const payload = await req.text();
    const body = JSON.parse(payload);

    // Verify webhook signature (you'd need to set up CLERK_WEBHOOK_SECRET)
    if (process.env.CLERK_WEBHOOK_SECRET) {
      const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
      try {
        wh.verify(payload, {
          "svix-id": svixId,
          "svix-timestamp": svixTimestamp,
          "svix-signature": svixSignature,
        });
      } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occurred", { status: 400 });
      }
    }

    const { type, data: eventData } = body;

    // Handle different Clerk events
    switch (type) {
      case "user.created":
        // Initialize free subscription for new users
        await convex.mutation(api.subscriptions.initializeUserSubscription, {
          userId: eventData.id,
        });
        break;

      case "subscription.created":
      case "subscription.updated":
        // Update user subscription
        await convex.mutation(api.subscriptions.createOrUpdateSubscription, {
          userId: eventData.user_id,
          plan: eventData.plan_id === "pro_plan_id" ? "pro" : "starter", // You'd map actual plan IDs
          status: eventData.status === "active" ? "active" : "canceled",
          currentPeriodStart: eventData.current_period_start * 1000,
          currentPeriodEnd: eventData.current_period_end * 1000,
        });
        break;

      case "subscription.deleted":
        // Cancel user subscription
        await convex.mutation(api.subscriptions.cancelSubscription, {
          userId: eventData.user_id,
        });
        break;

      default:
        console.log(`Unhandled webhook type: ${type}`);
    }

    return new Response("OK");
  } catch (error) {
    console.error("Error processing Clerk webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
};
