"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Share2 } from "lucide-react";
import { SeoReport } from "@/lib/seo-schema";

interface SummaryHeaderProps {
  seoReport?: SeoReport;
}

export function SummaryHeader({ seoReport }: SummaryHeaderProps) {
  return (
    <div className="border-b bg-gradient-to-r from-card via-card/95 to-card backdrop-blur-sm">
      <div className="w-full max-w-7xl mx-auto px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              {seoReport?.meta.entity_name || "SEO Report"}
            </h1>
            <p className="text-lg text-muted-foreground flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                Comprehensive SEO analysis
              </span>
              {seoReport?.meta?.analysis_date && (
                <span className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
                  {seoReport.meta.analysis_date}
                </span>
              )}
              {typeof seoReport?.meta?.data_sources_count === "number" && (
                <span className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
                  {seoReport.meta.data_sources_count} sources analyzed
                </span>
              )}
            </p>
          </div>

          <Badge
            variant="outline"
            className="text-base px-4 py-2 border-primary/20 bg-primary/5"
          >
            <CheckCircle className="h-4 w-4 mr-2 text-primary" />
            {seoReport?.meta?.confidence_score !== undefined
              ? `${Math.round(seoReport.meta.confidence_score * 100)}% Confidence`
              : "No confidence score"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
