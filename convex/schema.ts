import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  scrapingJobs: defineTable({
    // User association
    userId: v.string(),
    
    // User input
    originalPrompt: v.string(),

    // Job tracking
    snapshotId: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),

    // Results (optional, filled when webhook receives data)
    results: v.optional(v.array(v.any())),
    error: v.optional(v.string()),

    // Metadata
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"])
    .index("by_user_id", ["userId"])
    .index("by_user_and_status", ["userId", "status"]),
    
  userSubscriptions: defineTable({
    userId: v.string(),
    plan: v.union(v.literal("free"), v.literal("starter"), v.literal("pro")),
    status: v.union(v.literal("active"), v.literal("canceled"), v.literal("past_due")),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    reportsUsedThisMonth: v.number(),
    lastResetDate: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"]),
});
