import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const createScrapingJob = mutation({
  args: {
    originalPrompt: v.string(),
  },
  returns: v.id("scrapingJobs"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Must be authenticated to create scraping job");
    }

    const userId = identity.subject;
    
    // Check if user can generate more reports
    const canGenerate = await canUserGenerateReport(ctx, userId);
    if (!canGenerate) {
      throw new ConvexError("Report limit reached. Please upgrade your plan or wait until next month.");
    }

    const jobId = await ctx.db.insert("scrapingJobs", {
      userId,
      originalPrompt: args.originalPrompt,
      status: "pending",
      createdAt: Date.now(),
    });
    
    // Increment user's report count
    await incrementUserReportCount(ctx, userId);
    
    return jobId;
  },
});

export const updateJobWithSnapshotId = mutation({
  args: {
    jobId: v.id("scrapingJobs"),
    snapshotId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      snapshotId: args.snapshotId,
      status: "running",
    });
    return null;
  },
});

export const getJobById = query({
  args: {
    jobId: v.id("scrapingJobs"),
  },
  returns: v.union(
    v.object({
      _id: v.id("scrapingJobs"),
      _creationTime: v.number(),
      originalPrompt: v.string(),
      snapshotId: v.optional(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("running"),
        v.literal("completed"),
        v.literal("failed")
      ),
      results: v.optional(v.array(v.any())),
      error: v.optional(v.string()),
      createdAt: v.number(),
      completedAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobId);
  },
});

export const completeJob = mutation({
  args: {
    jobId: v.id("scrapingJobs"),
    results: v.array(v.any()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: "completed",
      results: args.results,
      completedAt: Date.now(),
    });
    return null;
  },
});

export const failJob = mutation({
  args: {
    jobId: v.id("scrapingJobs"),
    error: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: "failed",
      error: args.error,
      completedAt: Date.now(),
    });
    return null;
  },
});

export const getUserJobs = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("scrapingJobs"),
      _creationTime: v.number(),
      userId: v.string(),
      originalPrompt: v.string(),
      snapshotId: v.optional(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("running"),
        v.literal("completed"),
        v.literal("failed")
      ),
      results: v.optional(v.array(v.any())),
      error: v.optional(v.string()),
      createdAt: v.number(),
      completedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Must be authenticated to view jobs");
    }

    const userId = identity.subject;
    const jobs = await ctx.db
      .query("scrapingJobs")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return jobs;
  },
});

// Helper functions for subscription management

async function canUserGenerateReport(ctx: any, userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(ctx, userId);
  
  if (!subscription || subscription.status !== "active") {
    return false; // Free users can't generate reports
  }
  
  // Check if it's a new month and reset count if needed
  await resetReportCountIfNewMonth(ctx, userId, subscription);
  
  // Refresh subscription after potential reset
  const updatedSubscription = await getUserSubscription(ctx, userId);
  if (!updatedSubscription) return false;
  
  if (updatedSubscription.plan === "pro") {
    return true; // Pro users have unlimited reports
  }
  
  if (updatedSubscription.plan === "starter") {
    return updatedSubscription.reportsUsedThisMonth < 10; // Starter limit
  }
  
  return false;
}

async function getUserSubscription(ctx: any, userId: string) {
  return await ctx.db
    .query("userSubscriptions")
    .withIndex("by_user_id", (q) => q.eq("userId", userId))
    .first();
}

async function incrementUserReportCount(ctx: any, userId: string) {
  const subscription = await getUserSubscription(ctx, userId);
  if (subscription) {
    await ctx.db.patch(subscription._id, {
      reportsUsedThisMonth: subscription.reportsUsedThisMonth + 1,
      updatedAt: Date.now(),
    });
  }
}

async function resetReportCountIfNewMonth(ctx: any, userId: string, subscription: any) {
  const now = Date.now();
  const lastReset = new Date(subscription.lastResetDate);
  const currentDate = new Date(now);
  
  // Check if we're in a new month
  if (
    currentDate.getMonth() !== lastReset.getMonth() ||
    currentDate.getFullYear() !== lastReset.getFullYear()
  ) {
    await ctx.db.patch(subscription._id, {
      reportsUsedThisMonth: 0,
      lastResetDate: now,
      updatedAt: now,
    });
  }
}

export const getUserReportCount = query({
  args: {},
  returns: v.object({
    used: v.number(),
    limit: v.number(),
    plan: v.string(),
  }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Must be authenticated");
    }

    const userId = identity.subject;
    const subscription = await getUserSubscription(ctx, userId);
    
    if (!subscription || subscription.status !== "active") {
      return { used: 0, limit: 0, plan: "free" };
    }
    
    // Reset count if new month
    await resetReportCountIfNewMonth(ctx, userId, subscription);
    
    // Get updated subscription
    const updatedSubscription = await getUserSubscription(ctx, userId);
    if (!updatedSubscription) {
      return { used: 0, limit: 0, plan: "free" };
    }
    
    const limit = updatedSubscription.plan === "pro" ? -1 : 10; // -1 means unlimited
    
    return {
      used: updatedSubscription.reportsUsedThisMonth,
      limit,
      plan: updatedSubscription.plan,
    };
  },
});
