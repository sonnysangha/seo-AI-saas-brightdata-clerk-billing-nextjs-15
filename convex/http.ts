// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { systemPrompt, buildAnalysisPrompt } from "@/prompts/gpt";
import { seoReportSchema } from "@/lib/seo-schema";

const http = httpRouter();

// make a safe datatyope enum maybe for all API paths
export enum ApiPath {
  Webhook = "/api/webhook",
}

http.route({
  path: ApiPath.Webhook,
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    type Job = {
      _id: Id<"scrapingJobs">;
      originalPrompt: string;
      status: string;
    };

    let job: Job | null = null;

    try {
      const data = await req.json();
      console.log("Webhook received data:", data);

      // Extract job ID from the webhook URL query parameters
      const url = new URL(req.url);
      const jobId = url.searchParams.get("jobId");

      if (!jobId) {
        console.error("No job ID found in webhook data:", data);
        return new Response("No job ID found", { status: 400 });
      }

      // Find the job by ID
      job = await ctx.runQuery(api.scrapingJobs.getJobById, {
        jobId: jobId as Id<"scrapingJobs">,
      });

      if (!job) {
        console.error(`No job found for job ID: ${jobId}`);
        return new Response(`No job found for job ID: ${jobId}`, {
          status: 404,
        });
      }

      // Transition to analyzing status to start the AI analysis
      await ctx.runMutation(api.scrapingJobs.setJobToAnalyzing, {
        jobId: job._id,
      });

      // Generate comprehensive SEO report using structured output
      const scrapingData = Array.isArray(data) ? data : [data];
      const analysisPrompt = buildAnalysisPrompt(scrapingData);

      console.log("Generating SEO report for job:", job._id);

      const { object: seoReport } = await generateObject({
        model: openai("gpt-4o"),
        system: systemPrompt(),
        prompt: analysisPrompt,
        schema: seoReportSchema,
        maxRetries: 2, // Retry if schema validation fails
      });

      console.log("SEO report generated successfully:", {
        entity_name: seoReport.meta.entity_name,
        entity_type: seoReport.meta.entity_type,
        confidence_score: seoReport.meta.confidence_score,
        total_sources: seoReport.inventory.total_sources,
        recommendations_count: seoReport.recommendations.length,
        summary_score: seoReport.summary.overall_score,
      });

      console.log("SEO FULL REPORT", seoReport);

      // Save both the raw scraping data and the structured SEO report
      const rawResults = Array.isArray(data) ? data : [data];
      await ctx.runMutation(internal.scrapingJobs.completeJob, {
        jobId: job._id,
        results: rawResults,
        seoReport: seoReport,
      });
      console.log(`Job ${job._id} completed with job ID ${jobId}`);

      console.log(
        `Job ${job._id} moved to analyzing status with job ID ${jobId}`
      );

      return new Response("Success", { status: 200 });
    } catch (error) {
      console.error("Webhook error:", error);

      // Set job status to failed when analysis fails (only if job was found)
      if (job) {
        try {
          await ctx.runMutation(api.scrapingJobs.failJob, {
            jobId: job._id,
            error:
              error instanceof Error
                ? error.message
                : "Unknown error occurred during analysis",
          });
          console.log(`Job ${job._id} marked as failed due to analysis error`);
        } catch (failError) {
          console.error("Failed to update job status to failed:", failError);
        }
      }

      // If it's a schema validation error, provide more specific feedback
      if (error instanceof Error && error.message.includes("schema")) {
        console.error("Schema validation failed - AI response incomplete");
        console.error("Error details:", error.message);
      }

      return new Response("Internal Server Error", { status: 500 });
    }
  }),
});

export default http;
