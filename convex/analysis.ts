"use node";

import { internalAction, action } from "./_generated/server";
import { v } from "convex/values";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { buildAnalysisPrompt, systemPrompt } from "@/prompts/gpt";
import { seoReportSchema } from "@/lib/seo-schema";
import { internal, api } from "./_generated/api";

/**
 * Run AI analysis on existing scraping data for a job.
 * This runs as a background action and can take as long as needed.
 */
export const runAnalysis = internalAction({
  args: {
    jobId: v.id("scrapingJobs"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    console.log("Starting AI analysis for job:", args.jobId);

    try {
      // Get the job and its raw data
      const job = await ctx.runQuery(api.scrapingJobs.getJobById, {
        jobId: args.jobId,
      });

      if (!job) {
        console.error(`No job found for job ID: ${args.jobId}`);
        return null;
      }

      if (!job.results || job.results.length === 0) {
        console.error(`No scraping results found for job: ${args.jobId}`);
        await ctx.runMutation(api.scrapingJobs.failJob, {
          jobId: args.jobId,
          error: "No scraping results available for analysis",
        });
        return null;
      }

      // Set job status to analyzing
      await ctx.runMutation(api.scrapingJobs.setJobToAnalyzing, {
        jobId: args.jobId,
      });

      // Step 1: Generate comprehensive SEO report using structured output
      const scrapingData = Array.isArray(job.results)
        ? job.results
        : [job.results];
      const analysisPrompt = buildAnalysisPrompt(scrapingData);

      console.log("Generating SEO report for job:", args.jobId);

      // Save prompt into the database for debugging
      await ctx.runMutation(internal.scrapingJobs.saveOriginalPrompt, {
        jobId: args.jobId,
        prompt: analysisPrompt,
      });

      console.log("Prompt saved for job:", args.jobId);

      const { object: seoReport } = await generateObject({
        model: openai("gpt-4o"),
        system: systemPrompt(),
        prompt: analysisPrompt,
        schema: seoReportSchema,
      });

      console.log("SEO report generated successfully:", {
        entity_name: seoReport.meta.entity_name,
        entity_type: seoReport.meta.entity_type,
        confidence_score: seoReport.meta.confidence_score,
        total_sources: seoReport.inventory.total_sources,
        recommendations_count: seoReport.recommendations?.length || 0,
        summary_score: seoReport.summary?.overall_score || 0,
      });

      // Step 2: Save the SEO report to the database
      await ctx.runMutation(internal.scrapingJobs.saveSeoReport, {
        jobId: args.jobId,
        seoReport: seoReport,
      });

      console.log("SEO report saved for job:", args.jobId);

      // Step 3: Complete the job (mark as completed)
      await ctx.runMutation(internal.scrapingJobs.completeJob, {
        jobId: args.jobId,
      });

      console.log(`Job ${args.jobId} analysis completed successfully`);

      return null;
    } catch (error) {
      console.error("Analysis error for job:", args.jobId, error);

      // Set job status to failed when analysis fails
      try {
        await ctx.runMutation(api.scrapingJobs.failJob, {
          jobId: args.jobId,
          error:
            error instanceof Error
              ? error.message
              : "Unknown error occurred during analysis",
        });
        console.log(`Job ${args.jobId} marked as failed due to analysis error`);
      } catch (failError) {
        console.error("Failed to update job status to failed:", failError);
      }

      // If it's a schema validation error, provide more specific feedback
      if (error instanceof Error && error.message.includes("schema")) {
        console.error("Schema validation failed - AI response incomplete");
        console.error("Error details:", error.message);
      }

      return null;
    }
  },
});

/**
 * Retry analysis for a job that already has scraping data.
 * This is used for smart retries when analysis fails but scraping succeeded.
 */
export const retryAnalysisOnly = action({
  args: {
    jobId: v.id("scrapingJobs"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    console.log("Retrying analysis only for job:", args.jobId);

    // Reset job status and clear previous analysis results
    await ctx.runMutation(internal.scrapingJobs.resetJobForAnalysisRetry, {
      jobId: args.jobId,
    });

    // Run the analysis by calling the internal action
    await ctx.runAction(internal.analysis.runAnalysis, {
      jobId: args.jobId,
    });

    return null;
  },
});
