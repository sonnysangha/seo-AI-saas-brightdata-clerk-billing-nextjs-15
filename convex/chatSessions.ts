import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createChatSession = mutation({
  args: {
    jobId: v.id("scrapingJobs"),
    title: v.string(),
  },
  returns: v.id("chatSessions"),
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("chatSessions", {
      jobId: args.jobId,
      title: args.title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return sessionId;
  },
});

export const getChatSession = query({
  args: {
    sessionId: v.id("chatSessions"),
  },
  returns: v.union(
    v.object({
      _id: v.id("chatSessions"),
      _creationTime: v.number(),
      jobId: v.id("scrapingJobs"),
      title: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

export const getChatSessionsByJob = query({
  args: {
    jobId: v.id("scrapingJobs"),
  },
  returns: v.array(
    v.object({
      _id: v.id("chatSessions"),
      _creationTime: v.number(),
      jobId: v.id("scrapingJobs"),
      title: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatSessions")
      .withIndex("by_job_id", (q) => q.eq("jobId", args.jobId))
      .order("desc")
      .collect();
  },
});

export const updateChatSessionTitle = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    title: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      title: args.title,
      updatedAt: Date.now(),
    });
    return null;
  },
});