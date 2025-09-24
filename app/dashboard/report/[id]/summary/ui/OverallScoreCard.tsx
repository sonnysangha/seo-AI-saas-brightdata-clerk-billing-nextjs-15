"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle } from "lucide-react";
import { SeoReport } from "@/lib/seo-schema";

interface OverallScoreCardProps {
  seoReport: SeoReport;
}

export function OverallScoreCard({ seoReport }: OverallScoreCardProps) {
  const fmt = (n: number | undefined | null) =>
    typeof n === "number" && !Number.isNaN(n) ? n.toLocaleString() : "—";

  return (
    <Card className="border-none shadow-2xl bg-gradient-to-br from-primary/5 via-primary/8 to-primary/12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/3 rounded-full translate-y-12 -translate-x-12" />
      <CardContent className="p-8 lg:p-12 relative">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Overall SEO Score
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Based on comprehensive analysis of{" "}
              <span className="font-semibold text-foreground">
                {fmt(seoReport?.meta?.data_sources_count)}
              </span>{" "}
              sources across multiple domains and platforms
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Award className="h-4 w-4 mr-2" />
                Professional Analysis
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Validated Results
              </Badge>
            </div>
          </div>
          <div className="text-center lg:text-right">
            <div className="relative inline-block">
              <div className="text-8xl lg:text-9xl font-bold bg-gradient-to-br from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                {Math.round(
                  (seoReport?.summary?.overall_score ?? 0) < 1
                    ? (seoReport?.summary?.overall_score ?? 0) * 100
                    : (seoReport?.summary?.overall_score ?? 0)
                )}
              </div>
              <div className="absolute -bottom-2 right-0 text-2xl font-bold text-muted-foreground">
                /100
              </div>
            </div>
            <div className="mt-4 text-lg text-muted-foreground">
              SEO Performance Score
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
