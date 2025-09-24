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
  Globe,
  Search,
  Target,
  TrendingUp,
  CheckCircle,
  Award,
} from "lucide-react";
import { SeoReport } from "@/lib/seo-schema";

interface AdditionalAnalysisGridProps {
  seoReport: SeoReport;
}

export function AdditionalAnalysisGrid({
  seoReport,
}: AdditionalAnalysisGridProps) {
  const contentThemes = (seoReport?.content_analysis?.content_themes || [])
    .map((t) => ({ theme: t.theme, frequency: t.frequency }))
    .filter(
      (t) => typeof t.frequency === "number" && Number.isFinite(t.frequency)
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Backlink Sources Analysis */}
      <Card className="border bg-gradient-to-br from-card to-card/95">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50">
              <Globe className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-2xl">Backlink Sources</CardTitle>
              <CardDescription className="text-base">
                External sources linking to or mentioning the entity
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 max-h-96 overflow-y-auto">
            {(seoReport?.backlink_analysis?.backlink_sources || []).map(
              (source, index) => {
                const sourceTypeConfig = {
                  educational_citations: {
                    bgClass:
                      "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
                    borderClass: "border-blue-200 dark:border-blue-800",
                    iconClass: "text-blue-600 dark:text-blue-400",
                    badgeClass:
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
                    icon: CheckCircle,
                  },
                  press_coverage: {
                    bgClass:
                      "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
                    borderClass: "border-purple-200 dark:border-purple-800",
                    iconClass: "text-purple-600 dark:text-purple-400",
                    badgeClass:
                      "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
                    icon: TrendingUp,
                  },
                  professional_references: {
                    bgClass:
                      "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
                    borderClass: "border-green-200 dark:border-green-800",
                    iconClass: "text-green-600 dark:text-green-400",
                    badgeClass:
                      "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
                    icon: Award,
                  },
                };

                const config = sourceTypeConfig[
                  source.source_type as keyof typeof sourceTypeConfig
                ] || {
                  bgClass:
                    "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30",
                  borderClass: "border-gray-200 dark:border-gray-800",
                  iconClass: "text-gray-600 dark:text-gray-400",
                  badgeClass:
                    "bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300",
                  icon: Globe,
                };
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
                          <h4 className="font-bold text-lg leading-tight line-clamp-2">
                            {source.title}
                          </h4>
                          <Badge
                            className={`${config.badgeClass} border-0 text-sm px-3 py-1 capitalize ml-2`}
                          >
                            {source.source_type.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                          {source.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate flex-1 mr-3 font-medium text-sm"
                          >
                            {source.domain}
                          </a>
                          {source.evidence && source.evidence.length > 0 && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-white/80 dark:bg-black/20"
                            >
                              {Math.round(
                                source.evidence[0].relevance_score * 100
                              )}
                              % relevance
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
            {(!seoReport?.backlink_analysis?.backlink_sources ||
              seoReport.backlink_analysis.backlink_sources.length === 0) && (
              <div className="text-center py-12 bg-muted/20 rounded-xl">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  No backlink sources found.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Themes & Domain Analysis */}
      <Card className="border bg-gradient-to-br from-card to-card/95">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50">
              <Search className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <CardTitle className="text-2xl">Content Analysis</CardTitle>
              <CardDescription className="text-base">
                Content themes and domain quality insights
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Content Themes */}
            <div className="p-4 rounded-xl border bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border-teal-200 dark:border-teal-800">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                <h4 className="font-bold text-lg text-teal-900 dark:text-teal-100">
                  Content Themes
                </h4>
              </div>
              <div className="grid gap-3 max-h-40 overflow-y-auto">
                {contentThemes.map((theme) => (
                  <div
                    key={theme.theme}
                    className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded-lg"
                  >
                    <span className="font-medium truncate flex-1 mr-3 text-teal-900 dark:text-teal-100">
                      {theme.theme}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300"
                    >
                      {theme.frequency}
                    </Badge>
                  </div>
                ))}
                {contentThemes.length === 0 && (
                  <p className="text-center py-4 text-teal-600 dark:text-teal-400">
                    No content themes found.
                  </p>
                )}
              </div>
            </div>

            {/* Overall Sentiment */}
            <div className="p-4 rounded-xl border bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="font-bold text-lg text-indigo-900 dark:text-indigo-100">
                    Overall Sentiment
                  </h4>
                </div>
                <Badge
                  className={`border-0 text-sm px-3 py-1 capitalize ${
                    seoReport?.content_analysis?.sentiment?.overall ===
                    "positive"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                      : seoReport?.content_analysis?.sentiment?.overall ===
                          "negative"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300"
                  }`}
                >
                  {seoReport?.content_analysis?.sentiment?.overall || "unknown"}
                </Badge>
              </div>
              <p className="text-indigo-700 dark:text-indigo-300 leading-relaxed">
                Based on analysis of content themes and mentions
              </p>
            </div>

            {/* Top Domains */}
            <div className="p-4 rounded-xl border bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h4 className="font-bold text-lg text-amber-900 dark:text-amber-100">
                  Top Domains
                </h4>
              </div>
              <div className="grid gap-3 max-h-40 overflow-y-auto">
                {(seoReport?.inventory?.unique_domains || []).map((domain) => {
                  // Find sources from this domain to get quality scores
                  const domainSources = Object.values(
                    seoReport?.inventory?.source_types || {}
                  )
                    .flat()
                    .filter(
                      (source: { domain?: string }) => source.domain === domain
                    );
                  const avgQuality =
                    domainSources.length > 0
                      ? domainSources.reduce(
                          (acc: number, source: { quality_score?: number }) =>
                            acc + (source.quality_score || 0),
                          0
                        ) / domainSources.length
                      : 0;

                  return (
                    <div
                      key={domain}
                      className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded-lg"
                    >
                      <span className="font-medium truncate flex-1 mr-3 text-amber-900 dark:text-amber-100">
                        {domain}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-muted rounded-full">
                          <div
                            className="h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                            style={{ width: `${avgQuality * 100}%` }}
                          />
                        </div>
                        <span className="text-amber-700 dark:text-amber-300 font-medium text-sm w-10">
                          {Math.round(avgQuality * 100)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
