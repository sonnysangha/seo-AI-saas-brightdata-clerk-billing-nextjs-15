// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

// make a safe datatyope enum maybe for all API paths
export enum ApiPath {
  Webhook = "/api/webhook",
}

http.route({
  path: ApiPath.Webhook,
  method: "POST",
  handler: httpAction(async (ctx, req) => {
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
      const job = await ctx.runQuery(api.scrapingJobs.getJobById, {
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

      // Simulate AI analysis with a timeout for 5 seconds
      setTimeout(async () => {
        try {
          // Save the results to the job and mark as completed
          const results = Array.isArray(data) ? data : [data];
          await ctx.runMutation(internal.scrapingJobs.completeJob, {
            jobId: job._id,
            results: results,
          });
          console.log(`Job ${job._id} completed with job ID ${jobId}`);
        } catch (error) {
          console.error("Error completing job:", error);
          await ctx.runMutation(api.scrapingJobs.failJob, {
            jobId: job._id,
            error: "Failed to complete AI analysis",
          });
        }
      }, 5000); // 5 second timeout for AI analysis

      console.log(
        `Job ${job._id} moved to analyzing status with job ID ${jobId}`
      );
      return new Response("Success", { status: 200 });
    } catch (error) {
      console.error("Webhook error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }),
});

export default http;
