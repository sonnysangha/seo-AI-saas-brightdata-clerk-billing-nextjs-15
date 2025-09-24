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
import { Users, Award } from "lucide-react";
import { SeoReport } from "@/lib/seo-schema";

interface CompetitorStrengthCardProps {
  seoReport: SeoReport;
}

export function CompetitorStrengthCard({
  seoReport,
}: CompetitorStrengthCardProps) {
  const competitorStrength = (seoReport?.competitors || [])
    .filter((c) => c.strength_score && c.name)
    .map((c) => ({
      name: c.name,
      strength: Number(c.strength_score),
    }));

  return (
    <Card className="border bg-gradient-to-br from-card to-card/95">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/50">
            <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Competitor Strength</CardTitle>
            <CardDescription className="text-base">
              Market positioning & strength analysis
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {competitorStrength.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No Competitors found
          </div>
        ) : (
          <div className="space-y-4">
            {competitorStrength.map((c, index) => {
              const percentage = Math.round(
                c.strength < 1 ? c.strength * 100 : c.strength
              );
              const isTop = index < 2;
              return (
                <div
                  key={c.name}
                  className={`p-4 rounded-lg ${isTop ? "bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200 dark:border-orange-800" : "bg-muted/30"}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {isTop && <Award className="h-4 w-4 text-orange-500" />}
                      <span className="font-semibold truncate">{c.name}</span>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={isTop ? "default" : "secondary"}
                        className={
                          isTop
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300"
                            : ""
                        }
                      >
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          isTop
                            ? "bg-gradient-to-r from-orange-500 to-red-500"
                            : "bg-gradient-to-r from-primary/70 to-primary"
                        }`}
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                        }}
                      />
                    </div>
                    <div
                      className="absolute -top-1 text-xs text-muted-foreground"
                      style={{ left: `${Math.min(percentage, 95)}%` }}
                    >
                      {percentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
