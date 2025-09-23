import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  scrapingJobs: defineTable({
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

    // SEO Report (processed results)
    seoReport: v.optional(v.any()),

    // Metadata
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  chatSessions: defineTable({
    // Associated scraping job
    jobId: v.id("scrapingJobs"),
    
    // Session metadata
    title: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_job_id", ["jobId"])
    .index("by_created_at", ["createdAt"]),

  chatMessages: defineTable({
    // Associated chat session
    sessionId: v.id("chatSessions"),
    
    // Message content
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    
    // Metadata
    createdAt: v.number(),
  })
    .index("by_session_id", ["sessionId"])
    .index("by_created_at", ["createdAt"]),
});
