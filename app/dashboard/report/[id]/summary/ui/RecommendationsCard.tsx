"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  ArrowUpRight,
  Target,
} from "lucide-react";
import { SeoReport } from "@/lib/seo-schema";

interface RecommendationsCardProps {
  seoReport: SeoReport;
}

export function RecommendationsCard({ seoReport }: RecommendationsCardProps) {
  return (
    <Card className="border bg-gradient-to-br from-card to-card/95">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50">
            <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <CardTitle className="text-2xl">
              Actionable Recommendations
            </CardTitle>
            <CardDescription className="text-base">
              Prioritized strategies to boost your SEO performance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {(seoReport?.recommendations || []).map((rec, index) => {
            const priorityConfig = {
              high: {
                bgClass:
                  "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30",
                borderClass: "border-red-200 dark:border-red-800",
                iconClass: "text-red-600 dark:text-red-400",
                badgeClass:
                  "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
                icon: AlertTriangle,
              },
              medium: {
                bgClass:
                  "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30",
                borderClass: "border-amber-200 dark:border-amber-800",
                iconClass: "text-amber-600 dark:text-amber-400",
                badgeClass:
                  "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
                icon: TrendingUp,
              },
              low: {
                bgClass:
                  "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
                borderClass: "border-blue-200 dark:border-blue-800",
                iconClass: "text-blue-600 dark:text-blue-400",
                badgeClass:
                  "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
                icon: CheckCircle,
              },
            };

            const config =
              priorityConfig[rec.priority as keyof typeof priorityConfig] ||
              priorityConfig.medium;
            const IconComponent = config.icon;

            return (
              <div
                key={index}
                className={`p-6 rounded-xl border ${config.bgClass} ${config.borderClass} hover:shadow-lg transition-all duration-300 group`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full bg-white/80 dark:bg-black/20 ${config.iconClass} flex-shrink-0`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-lg leading-tight">
                        {rec.title}
                      </h4>
                      <Badge
                        className={`${config.badgeClass} border-0 text-sm px-3 py-1 capitalize`}
                      >
                        {rec.priority} Priority
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {rec.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-white/50 dark:bg-black/20">
                          <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="font-medium">Impact:</span>
                        <span className="capitalize bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-green-700 dark:text-green-300">
                          {rec.expected_impact}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-white/50 dark:bg-black/20">
                          <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="font-medium">Effort:</span>
                        <span className="capitalize bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded text-purple-700 dark:text-purple-300">
                          {rec.effort_required}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {(!seoReport?.recommendations ||
            seoReport.recommendations.length === 0) && (
            <div className="text-center py-12 bg-muted/20 rounded-xl">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                No recommendations available at this time.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
