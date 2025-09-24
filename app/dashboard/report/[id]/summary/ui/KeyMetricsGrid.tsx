"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Globe, Target, Users } from "lucide-react";
import { SeoReport } from "@/lib/seo-schema";

interface KeyMetricsGridProps {
  seoReport: SeoReport;
}

export function KeyMetricsGrid({ seoReport }: KeyMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* Keywords Found */}
      <Card className="relative overflow-hidden border bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 group hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {seoReport?.keywords?.content_keywords?.length ?? 0}
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                Keywords Found
              </div>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50">
              <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex-1">
            {seoReport?.keywords?.content_keywords &&
            seoReport.keywords.content_keywords.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {seoReport.keywords.content_keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  >
                    {keyword.keyword}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                No keywords found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Total Sources */}
      <Card className="relative overflow-hidden border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 group hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {seoReport?.inventory?.total_sources ?? 0}
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                Total Sources
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50">
              <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex-1">
            {seoReport?.inventory?.unique_domains &&
            seoReport.inventory.unique_domains.length > 0 ? (
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {seoReport.inventory.unique_domains.map((domain, index) => (
                  <div
                    key={index}
                    className="text-xs text-muted-foreground truncate bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded"
                  >
                    {domain}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                No domains found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Unique Domains */}
      <Card className="relative overflow-hidden border bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 group hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {seoReport?.inventory?.unique_domains?.length ?? 0}
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                Unique Domains
              </div>
            </div>
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/50">
              <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="flex-1 space-y-1 max-h-24 overflow-y-auto">
            {Object.entries(seoReport?.inventory?.source_types || {})
              .filter(
                ([, sources]) => Array.isArray(sources) && sources.length > 0
              )
              .map(([type, sources]) => (
                <div
                  key={type}
                  className="flex items-center justify-between text-xs bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded"
                >
                  <span className="capitalize text-muted-foreground">
                    {type.replace(/_/g, " ")}
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300"
                  >
                    {sources.length}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitors */}
      <Card className="relative overflow-hidden border bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 group hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {seoReport?.competitors?.length ?? 0}
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                Competitors
              </div>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex-1">
            {seoReport?.competitors && seoReport.competitors.length > 0 ? (
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {seoReport.competitors.map((competitor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-xs bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded"
                  >
                    <span className="truncate flex-1 mr-2 font-medium">
                      {competitor.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                    >
                      {Math.round(
                        competitor.strength_score < 1
                          ? competitor.strength_score * 100
                          : competitor.strength_score
                      )}
                      %
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                No competitors found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
