import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Test function to create sample subscriptions for testing
export const createTestSubscriptions = mutation({
  args: {
    userId: v.string(),
    plan: v.union(v.literal("free"), v.literal("starter"), v.literal("pro")),
  },
  returns: v.id("userSubscriptions"),
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if subscription already exists
    const existing = await ctx.db
      .query("userSubscriptions")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();
    
    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        plan: args.plan,
        status: "active",
        updatedAt: now,
      });
      return existing._id;
    }
    
    // Create new subscription
    return await ctx.db.insert("userSubscriptions", {
      userId: args.userId,
      plan: args.plan,
      status: "active",
      currentPeriodStart: now,
      currentPeriodEnd: now + 30 * 24 * 60 * 60 * 1000, // 30 days
      reportsUsedThisMonth: 0,
      lastResetDate: now,
      createdAt: now,
      updatedAt: now,
    });
  },
});