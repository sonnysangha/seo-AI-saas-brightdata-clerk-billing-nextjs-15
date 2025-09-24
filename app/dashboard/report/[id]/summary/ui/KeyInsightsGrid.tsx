"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { SeoReport } from "@/lib/seo-schema";

interface KeyInsightsGridProps {
  seoReport: SeoReport;
}

export function KeyInsightsGrid({ seoReport }: KeyInsightsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Strengths */}
      <Card className="border bg-gradient-to-br from-card to-card/95">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                Key Strengths
              </CardTitle>
              <CardDescription className="text-base">
                Areas where you're performing well
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(seoReport?.summary?.key_strengths || []).map(
              (strength, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-white/80 dark:bg-black/20 text-green-600 dark:text-green-400 flex-shrink-0">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed font-medium text-green-900 dark:text-green-100">
                        {strength}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
            {(!seoReport?.summary?.key_strengths ||
              seoReport.summary.key_strengths.length === 0) && (
              <div className="text-center py-8 bg-muted/20 rounded-xl">
                <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No strengths identified yet.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Critical Issues */}
      <Card className="border bg-gradient-to-br from-card to-card/95">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CardTitle className="text-2xl text-red-600 dark:text-red-400">
                Critical Issues
              </CardTitle>
              <CardDescription className="text-base">
                Urgent problems requiring attention
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(seoReport?.summary?.critical_issues || []).map((issue, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-red-200 dark:border-red-800 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-white/80 dark:bg-black/20 text-red-600 dark:text-red-400 flex-shrink-0">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed font-medium text-red-900 dark:text-red-100">
                      {issue}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {(!seoReport?.summary?.critical_issues ||
              seoReport.summary.critical_issues.length === 0) && (
              <div className="text-center py-8 bg-muted/20 rounded-xl">
                <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No critical issues found.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Wins */}
      <Card className="border bg-gradient-to-br from-card to-card/95">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">
                Quick Wins
              </CardTitle>
              <CardDescription className="text-base">
                Easy improvements for immediate impact
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(seoReport?.summary?.quick_wins || []).map((win, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-white/80 dark:bg-black/20 text-blue-600 dark:text-blue-400 flex-shrink-0">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed font-medium text-blue-900 dark:text-blue-100">
                      {win}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {(!seoReport?.summary?.quick_wins ||
              seoReport.summary.quick_wins.length === 0) && (
              <div className="text-center py-8 bg-muted/20 rounded-xl">
                <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No quick wins identified yet.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
