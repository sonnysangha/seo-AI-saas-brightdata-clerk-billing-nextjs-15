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
import { Search, Target, TrendingUp } from "lucide-react";
import { SeoReport } from "@/lib/seo-schema";

interface KeywordsAnalysisGridProps {
  seoReport: SeoReport;
}

export function KeywordsAnalysisGrid({ seoReport }: KeywordsAnalysisGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 min-w-0">
      {/* Content Keywords */}
      <Card className="border bg-gradient-to-br from-card to-card/95 min-w-0 w-full">
        <CardHeader className="pb-4 sm:pb-6">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 flex-shrink-0">
              <Search className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-xl sm:text-2xl leading-tight">
                Content Keywords
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Keywords derived from content analysis with search intent
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="min-w-0">
          <div className="grid gap-4 sm:gap-6">
            {(seoReport?.keywords?.content_keywords || []).map(
              (keyword, index) => {
                const intentConfig = {
                  informational: {
                    bgClass:
                      "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
                    borderClass: "border-blue-200 dark:border-blue-800",
                    iconClass: "text-blue-600 dark:text-blue-400",
                    badgeClass:
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
                    icon: Search,
                  },
                  navigational: {
                    bgClass:
                      "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
                    borderClass: "border-green-200 dark:border-green-800",
                    iconClass: "text-green-600 dark:text-green-400",
                    badgeClass:
                      "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
                    icon: Target,
                  },
                  transactional: {
                    bgClass:
                      "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30",
                    borderClass: "border-purple-200 dark:border-purple-800",
                    iconClass: "text-purple-600 dark:text-purple-400",
                    badgeClass:
                      "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
                    icon: TrendingUp,
                  },
                };

                const config = intentConfig[
                  keyword.intent as keyof typeof intentConfig
                ] || {
                  bgClass:
                    "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30",
                  borderClass: "border-gray-200 dark:border-gray-800",
                  iconClass: "text-gray-600 dark:text-gray-400",
                  badgeClass:
                    "bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300",
                  icon: Search,
                };
                const IconComponent = config.icon;

                return (
                  <div
                    key={index}
                    className={`p-3 sm:p-4 md:p-6 rounded-xl border ${config.bgClass} ${config.borderClass} hover:shadow-lg transition-all duration-300 group min-w-0`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`p-2 rounded-full bg-white/80 dark:bg-black/20 ${config.iconClass} flex-shrink-0`}
                      >
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3">
                          <h4 className="font-bold text-base sm:text-lg leading-tight break-words">
                            {keyword.keyword}
                          </h4>
                          <Badge
                            className={`${config.badgeClass} border-0 text-xs sm:text-sm px-2 sm:px-3 py-1 capitalize self-start`}
                          >
                            {keyword.intent || "unknown"} Intent
                          </Badge>
                        </div>
                        {keyword.evidence && keyword.evidence.length > 0 && (
                          <div className="space-y-3 max-h-40 overflow-y-auto">
                            <h5 className="text-sm font-medium text-muted-foreground">
                              Evidence Sources:
                            </h5>
                            {keyword.evidence.map((evidence, evidenceIndex) => (
                              <div
                                key={evidenceIndex}
                                className="bg-white/50 dark:bg-black/10 rounded-lg p-2 sm:p-3 border border-white/20 min-w-0"
                              >
                                <p className="text-sm text-muted-foreground mb-3 italic leading-relaxed break-words">
                                  &ldquo;{evidence.quote}&rdquo;
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                  <a
                                    href={evidence.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline font-medium text-sm break-all min-w-0"
                                  >
                                    {new URL(evidence.url).hostname}
                                  </a>
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-white/80 dark:bg-black/20 self-start sm:self-center flex-shrink-0"
                                  >
                                    {Math.round(evidence.relevance_score * 100)}
                                    % relevance
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
            {(!seoReport?.keywords?.content_keywords ||
              seoReport.keywords.content_keywords.length === 0) && (
              <div className="text-center py-12 bg-muted/20 rounded-xl">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  No content keywords found.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Keyword Themes */}
      <Card className="border bg-gradient-to-br from-card to-card/95 min-w-0 w-full">
        <CardHeader className="pb-4 sm:pb-6">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 flex-shrink-0">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-xl sm:text-2xl leading-tight">
                Keyword Themes
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Grouped keywords by thematic relevance and context
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="min-w-0">
          <div className="grid gap-4 sm:gap-6">
            {(seoReport?.keywords?.keyword_themes || []).map((theme, index) => {
              const themeConfig = {
                bgClass:
                  "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30",
                borderClass: "border-orange-200 dark:border-orange-800",
                iconClass: "text-orange-600 dark:text-orange-400",
                badgeClass:
                  "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
              };

              return (
                <div
                  key={index}
                  className={`p-3 sm:p-4 md:p-6 rounded-xl border ${themeConfig.bgClass} ${themeConfig.borderClass} hover:shadow-lg transition-all duration-300 group min-w-0`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={`p-2 rounded-full bg-white/80 dark:bg-black/20 ${themeConfig.iconClass} flex-shrink-0`}
                    >
                      <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-4">
                        <h4 className="font-bold text-base sm:text-lg leading-tight break-words">
                          {theme.theme}
                        </h4>
                        <Badge
                          className={`${themeConfig.badgeClass} border-0 text-xs sm:text-sm px-2 sm:px-3 py-1 self-start`}
                        >
                          {theme.keywords.length} Keywords
                        </Badge>
                      </div>

                      {/* Keywords in this theme */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-muted-foreground mb-2">
                          Related Keywords:
                        </h5>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {theme.keywords.map((kw, kwIndex) => (
                            <Badge
                              key={kwIndex}
                              variant="secondary"
                              className="text-xs bg-white/60 dark:bg-black/20 text-orange-700 dark:text-orange-300 break-words max-w-full"
                            >
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Evidence for this theme */}
                      {theme.evidence && theme.evidence.length > 0 && (
                        <div className="space-y-3 max-h-40 overflow-y-auto">
                          <h5 className="text-sm font-medium text-muted-foreground">
                            Supporting Evidence:
                          </h5>
                          {theme.evidence.map((evidence, evidenceIndex) => (
                            <div
                              key={evidenceIndex}
                              className="bg-white/50 dark:bg-black/10 rounded-lg p-2 sm:p-3 border border-white/20 min-w-0"
                            >
                              <p className="text-sm text-muted-foreground mb-3 italic leading-relaxed break-words">
                                &ldquo;{evidence.quote}&rdquo;
                              </p>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <a
                                  href={evidence.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline font-medium text-sm break-all min-w-0"
                                >
                                  {new URL(evidence.url).hostname}
                                </a>
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-white/80 dark:bg-black/20 self-start sm:self-center flex-shrink-0"
                                >
                                  {Math.round(evidence.relevance_score * 100)}%
                                  relevance
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {(!seoReport?.keywords?.keyword_themes ||
              seoReport.keywords.keyword_themes.length === 0) && (
              <div className="text-center py-12 bg-muted/20 rounded-xl">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  No keyword themes found.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
