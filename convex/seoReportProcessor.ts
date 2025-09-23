import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const processSeoReport = internalAction({
  args: {
    jobId: v.id("scrapingJobs"),
    perplexityData: v.array(v.any()),
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const { processSeoReport: processReport } = await import("../lib/seoReportProcessor");
    
    try {
      const seoReport = await processReport(args.perplexityData);
      return seoReport;
    } catch (error) {
      console.error(`Failed to process SEO report for job ${args.jobId}:`, error);
      throw error;
    }
  },
});