import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const createScrapingJob = mutation({
  args: {
    originalPrompt: v.string(),
  },
  returns: v.id("scrapingJobs"),
  handler: async (ctx, args) => {
    const jobId = await ctx.db.insert("scrapingJobs", {
      originalPrompt: args.originalPrompt,
      status: "pending",
      createdAt: Date.now(),
    });
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

export const completeJob = internalMutation({
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
    const jobs = await ctx.db
      .query("scrapingJobs")
      .withIndex("by_created_at")
      .order("desc")
      .collect();
    return jobs;
  },
});
