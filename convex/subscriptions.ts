import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

export const createOrUpdateSubscription = mutation({
  args: {
    userId: v.string(),
    plan: v.union(v.literal("free"), v.literal("starter"), v.literal("pro")),
    status: v.union(v.literal("active"), v.literal("canceled"), v.literal("past_due")),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
  },
  returns: v.id("userSubscriptions"),
  handler: async (ctx, args) => {
    const existingSubscription = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    const now = Date.now();

    if (existingSubscription) {
      // Update existing subscription
      await ctx.db.patch(existingSubscription._id, {
        plan: args.plan,
        status: args.status,
        currentPeriodStart: args.currentPeriodStart,
        currentPeriodEnd: args.currentPeriodEnd,
        updatedAt: now,
      });
      return existingSubscription._id;
    } else {
      // Create new subscription
      const subscriptionId = await ctx.db.insert("userSubscriptions", {
        userId: args.userId,
        plan: args.plan,
        status: args.status,
        currentPeriodStart: args.currentPeriodStart,
        currentPeriodEnd: args.currentPeriodEnd,
        reportsUsedThisMonth: 0,
        lastResetDate: now,
        createdAt: now,
        updatedAt: now,
      });
      return subscriptionId;
    }
  },
});

export const cancelSubscription = mutation({
  args: {
    userId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (subscription) {
      await ctx.db.patch(subscription._id, {
        status: "canceled",
        updatedAt: Date.now(),
      });
    }
    return null;
  },
});

export const getUserSubscription = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("userSubscriptions"),
      userId: v.string(),
      plan: v.union(v.literal("free"), v.literal("starter"), v.literal("pro")),
      status: v.union(v.literal("active"), v.literal("canceled"), v.literal("past_due")),
      currentPeriodStart: v.number(),
      currentPeriodEnd: v.number(),
      reportsUsedThisMonth: v.number(),
      lastResetDate: v.number(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const userId = identity.subject;
    return await ctx.db
      .query("userSubscriptions")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();
  },
});

export const initializeUserSubscription = mutation({
  args: {
    userId: v.string(),
  },
  returns: v.union(v.id("userSubscriptions"), v.null()),
  handler: async (ctx, args) => {
    // Check if user already has a subscription
    const existingSubscription = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (existingSubscription) {
      return existingSubscription._id;
    }

    // Create a free subscription for new users
    const now = Date.now();
    const subscriptionId = await ctx.db.insert("userSubscriptions", {
      userId: args.userId,
      plan: "free",
      status: "active",
      currentPeriodStart: now,
      currentPeriodEnd: now + 30 * 24 * 60 * 60 * 1000, // 30 days from now
      reportsUsedThisMonth: 0,
      lastResetDate: now,
      createdAt: now,
      updatedAt: now,
    });

    return subscriptionId;
  },
});