"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

/**
 * Retry analysis only for a job that already has scraping data.
 * This is used when we want to retry a failed analysis without re-scraping.
 */
const retryAnalysisOnly = async (jobId: string) => {
  // Initialize Convex client
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  try {
    console.log("Starting analysis-only retry for job:", jobId);

    // Trigger the analysis retry action
    await convex.action(api.analysis.retryAnalysisOnly, {
      jobId: jobId as Id<"scrapingJobs">,
    });

    return {
      ok: true,
      message: "Analysis retry started successfully",
    };
  } catch (error) {
    console.error("Failed to retry analysis:", error);

    // Mark job as failed
    await convex.mutation(api.scrapingJobs.failJob, {
      jobId: jobId as Id<"scrapingJobs">,
      error:
        error instanceof Error ? error.message : "Failed to retry analysis",
    });

    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Failed to retry analysis",
    };
  }
};

export default retryAnalysisOnly;
