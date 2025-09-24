"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AlertTriangle } from "lucide-react";
import { SeoReport } from "@/lib/seo-schema";
import {
  SummaryHeader,
  SourceDistributionChart,
  CompetitorStrengthCard,
  AdditionalAnalysisGrid,
  KeyInsightsGrid,
  KeywordsAnalysisGrid,
  RecommendationsCard,
  KeyMetricsGrid,
  OverallScoreCard,
} from "./ui";

interface ReportSummaryProps {
  params: Promise<{ id: string }>;
}

export default function ReportSummary({ params }: ReportSummaryProps) {
  const resolvedParams = React.use(params);
  const job = useQuery(api.scrapingJobs.getJobBySnapshotId, {
    snapshotId: resolvedParams.id,
  });

  const seoReport = job?.seoReport as SeoReport | undefined;

  if (job === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading SEO report...</p>
        </div>
      </div>
    );
  }

  if (job === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
          <p className="text-muted-foreground">
            The requested SEO report could not be found.
          </p>
        </div>
      </div>
    );
  }

  if (!seoReport) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
          <p className="text-muted-foreground">
            The requested SEO report could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <SummaryHeader seoReport={seoReport} />

      <div className="w-full max-w-7xl mx-auto px-8 py-12 space-y-12">
        <OverallScoreCard seoReport={seoReport} />
        <KeyMetricsGrid seoReport={seoReport} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <SourceDistributionChart seoReport={seoReport} />
          <CompetitorStrengthCard seoReport={seoReport} />
        </div>

        <RecommendationsCard seoReport={seoReport} />
        <KeywordsAnalysisGrid seoReport={seoReport} />
        <KeyInsightsGrid seoReport={seoReport} />
        <AdditionalAnalysisGrid seoReport={seoReport} />
      </div>
    </div>
  );
}
