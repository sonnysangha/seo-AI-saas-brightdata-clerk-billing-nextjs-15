"use server";

import { ApiPath } from "@/convex/http";
import { buildPerplexityPrompt } from "@/prompts/perplexity";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Environment check - only throw during runtime, not build time
const BRIGHTDATA_API_KEY = process.env.BRIGHTDATA_API_KEY;
if (!BRIGHTDATA_API_KEY && typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  console.warn("BRIGHTDATA_API_KEY is not set - some functionality may not work");
}

const startScraping = async (prompt: string) => {
  // Initialize Convex client
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  // Create a job record in the database
  const jobId = await convex.mutation(api.scrapingJobs.createScrapingJob, {
    originalPrompt: prompt,
  });

  // Include the job ID in the webhook URL as a query parameter
  const ENDPOINT = `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}${ApiPath.Webhook}?jobId=${jobId}`;
  const encodedEndpoint = encodeURIComponent(ENDPOINT);

  const url = `https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_m7dhdot1vw9a7gc1n&endpoint=${encodedEndpoint}&format=json&uncompressed_webhook=true&include_errors=true`;

  const perplexityPrompt = buildPerplexityPrompt(prompt);

  try {
    if (!BRIGHTDATA_API_KEY) {
      throw new Error("BRIGHTDATA_API_KEY is not configured");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BRIGHTDATA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: [
          {
            url: "https://www.perplexity.ai",
            prompt: perplexityPrompt,
            country: "US",
            index: 1,
          },
        ],
        custom_output_fields: [
          "url",
          "prompt",
          "answer_text",
          "sources",
          "citations",
          "timestamp",
          "input",
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      // Mark job as failed
      await convex.mutation(api.scrapingJobs.failJob, {
        jobId,
        error: `HTTP ${response.status} ${response.statusText}${text ? `: ${text}` : ""}`,
      });
      return {
        ok: false,
        error: `HTTP ${response.status} ${response.statusText}${text ? `: ${text}` : ""}`,
      };
    }

    const data = await response.json().catch(() => null);

    // Extract snapshot ID from the response and update the job
    if (data && data.snapshot_id) {
      await convex.mutation(api.scrapingJobs.updateJobWithSnapshotId, {
        jobId,
        snapshotId: data.snapshot_id,
      });
    }

    return { ok: true, data, jobId };
  } catch (error) {
    console.error(error);
    // Mark job as failed
    await convex.mutation(api.scrapingJobs.failJob, {
      jobId,
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export default startScraping;
