"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import {
  TrendingUp,
  Search,
  Globe,
  Target,
  Users,
  Award,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Download,
  Share2,
} from "lucide-react";
import { SeoReport } from "@/lib/seo-schema";

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

  const analyzing = job.status === "analyzing";
  const hasReport = !!seoReport;

  const fmt = (n: number | undefined | null) =>
    typeof n === "number" && !Number.isNaN(n) ? n.toLocaleString() : "—";

  const sourceTypeEntries = (() => {
    const st = seoReport?.inventory?.source_types as
      | Record<string, Array<unknown>>
      | undefined;
    if (!st) return [] as Array<{ name: string; value: number; color: string }>;
    const palette = [
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#06b6d4",
      "#22c55e",
      "#a855f7",
      "#f97316",
    ];
    return Object.entries(st)
      .filter(([, arr]) => Array.isArray(arr) && arr.length > 0)
      .map(([name, arr], idx) => ({
        name,
        value: (arr as Array<unknown>).length,
        color: palette[idx % palette.length],
      }));
  })();

  const competitorStrength = (seoReport?.competitors || [])
    .map((c) => {
      const raw =
        typeof c.strength_score === "string"
          ? Number(c.strength_score)
          : c.strength_score;
      const numeric = typeof raw === "number" ? raw : NaN;
      return {
        name: c.name || "(unknown)",
        strength: Number.isFinite(numeric)
          ? Math.max(0, Math.min(10, numeric))
          : NaN,
      };
    })
    .filter((d) => Number.isFinite(d.strength));

  const contentThemes = (seoReport?.content_analysis?.content_themes || [])
    .map((t) => ({ theme: t.theme, frequency: t.frequency }))
    .filter(
      (t) => typeof t.frequency === "number" && Number.isFinite(t.frequency)
    );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {seoReport?.meta.entity_name || "SEO Report"}
              </h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive SEO analysis
                {seoReport?.meta?.analysis_date
                  ? ` • ${seoReport.meta.analysis_date}`
                  : ""}
                {typeof seoReport?.meta?.data_sources_count === "number"
                  ? ` • ${seoReport.meta.data_sources_count} sources analyzed`
                  : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                <CheckCircle className="h-3 w-3 mr-1" />
                {seoReport?.meta?.confidence_score !== undefined
                  ? `${Math.round(seoReport.meta.confidence_score * 100)}% Confidence`
                  : "No confidence score"}
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Job state */}
        {!hasReport && analyzing && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                <p className="text-muted-foreground">
                  Your report is being analyzed. This page will update
                  automatically.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!hasReport && !analyzing && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <p className="text-muted-foreground">
                  No SEO report is attached to this job yet.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overall Score */}
        {hasReport && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Overall SEO Score
                    </h2>
                    <p className="text-muted-foreground">
                      Based on comprehensive analysis of{" "}
                      {fmt(seoReport?.meta?.data_sources_count)} sources
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-6xl font-bold text-primary">
                      {seoReport?.summary?.overall_score ?? 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      out of 100
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Keywords Found */}
          <Card className="relative overflow-hidden h-full">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-2xl font-bold">
                    {seoReport?.keywords?.content_keywords?.length ?? 0}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Keywords Found
                  </div>
                </div>
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                {seoReport?.keywords?.content_keywords &&
                seoReport.keywords.content_keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {seoReport.keywords.content_keywords.map(
                      (keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {keyword.keyword}
                        </Badge>
                      )
                    )}
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
          <Card className="relative overflow-hidden h-full">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-2xl font-bold">
                    {seoReport?.inventory?.total_sources ?? 0}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Total Sources
                  </div>
                </div>
                <Globe className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                {seoReport?.inventory?.unique_domains &&
                seoReport.inventory.unique_domains.length > 0 ? (
                  <div className="space-y-1">
                    {seoReport.inventory.unique_domains
                      .slice(0, 2)
                      .map((domain, index) => (
                        <div
                          key={index}
                          className="text-xs text-muted-foreground truncate"
                        >
                          {domain}
                        </div>
                      ))}
                    {seoReport.inventory.unique_domains.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{seoReport.inventory.unique_domains.length - 2} more
                      </div>
                    )}
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
          <Card className="relative overflow-hidden h-full">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-2xl font-bold">
                    {seoReport?.inventory?.unique_domains?.length ?? 0}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Unique Domains
                  </div>
                </div>
                <Target className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                {Object.entries(seoReport?.inventory?.source_types || {})
                  .filter(
                    ([, sources]) =>
                      Array.isArray(sources) && sources.length > 0
                  )
                  .slice(0, 3)
                  .map(([type, sources]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="capitalize text-muted-foreground">
                        {type.replace(/_/g, " ")}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {sources.length}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Competitors */}
          <Card className="relative overflow-hidden h-full">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-2xl font-bold">
                    {seoReport?.competitors?.length ?? 0}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Competitors
                  </div>
                </div>
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                {seoReport?.competitors && seoReport.competitors.length > 0 ? (
                  <div className="space-y-1">
                    {seoReport.competitors
                      .slice(0, 2)
                      .map((competitor, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="truncate flex-1 mr-1 text-muted-foreground">
                            {competitor.name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {competitor.strength_score.toFixed(1)}
                          </Badge>
                        </div>
                      ))}
                    {seoReport.competitors.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{seoReport.competitors.length - 2} more
                      </div>
                    )}
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

        {/* Analytics Grid */}
        <div
          className="grid gap-6 mb-8"
          style={{
            gridTemplateColumns:
              sourceTypeEntries.length > 0 && competitorStrength.length > 0
                ? "2fr 1fr"
                : "1fr",
          }}
        >
          {/* Source Types Distribution */}
          {sourceTypeEntries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Source Types Distribution</CardTitle>
                <CardDescription>
                  Breakdown of data sources by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={Object.fromEntries(
                    sourceTypeEntries.map((e) => [
                      e.name,
                      { label: e.name, color: e.color },
                    ])
                  )}
                  className="h-[300px] w-full"
                >
                  <PieChart>
                    <Pie
                      data={sourceTypeEntries}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                    >
                      {sourceTypeEntries.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* Competitor Strength Analysis */}
          {competitorStrength.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Competitor Strength</CardTitle>
                <CardDescription>Strength scores (0-10)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {competitorStrength.map((c) => {
                    const pct = Math.max(
                      0,
                      Math.min(100, (c.strength / 10) * 100)
                    );
                    return (
                      <div key={c.name} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium truncate">{c.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {c.strength.toFixed(1)}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded bg-muted">
                          <div
                            className="h-1.5 rounded bg-primary"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommendations */}
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5" />
                Actionable Recommendations
              </CardTitle>
              <CardDescription>
                Prioritized recommendations to improve your SEO performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(seoReport?.recommendations || []).map((rec, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{rec.title}</h4>
                      <Badge
                        variant={
                          rec.priority === "high"
                            ? "destructive"
                            : rec.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {rec.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ArrowUpRight className="h-3 w-3" />
                        Impact: {rec.expected_impact}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Effort: {rec.effort_required}
                      </span>
                    </div>
                  </div>
                ))}
                {(!seoReport?.recommendations ||
                  seoReport.recommendations.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No recommendations found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Keywords Analysis */}
        <div className="mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Keywords */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="h-5 w-5" />
                  Content Keywords
                </CardTitle>
                <CardDescription>
                  Keywords derived from content analysis with search intent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(seoReport?.keywords?.content_keywords || []).map(
                    (keyword, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">
                            {keyword.keyword}
                          </h4>
                          <Badge
                            variant={
                              keyword.intent === "informational"
                                ? "default"
                                : keyword.intent === "navigational"
                                  ? "secondary"
                                  : keyword.intent === "transactional"
                                    ? "destructive"
                                    : "outline"
                            }
                            className="text-xs"
                          >
                            {keyword.intent || "unknown"}
                          </Badge>
                        </div>
                        {keyword.evidence && keyword.evidence.length > 0 && (
                          <div className="space-y-2">
                            {keyword.evidence
                              .slice(0, 2)
                              .map((evidence, evidenceIndex) => (
                                <div
                                  key={evidenceIndex}
                                  className="bg-muted/50 rounded p-2"
                                >
                                  <p className="text-xs text-muted-foreground mb-1 italic">
                                    &ldquo;{evidence.quote}&rdquo;
                                  </p>
                                  <div className="flex items-center justify-between text-xs">
                                    <a
                                      href={evidence.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline truncate flex-1 mr-2"
                                    >
                                      {new URL(evidence.url).hostname}
                                    </a>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {Math.round(
                                        evidence.relevance_score * 100
                                      )}
                                      % relevance
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            {keyword.evidence.length > 2 && (
                              <p className="text-xs text-muted-foreground">
                                +{keyword.evidence.length - 2} more sources
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  )}
                  {(!seoReport?.keywords?.content_keywords ||
                    seoReport.keywords.content_keywords.length === 0) && (
                    <p className="text-sm text-muted-foreground">
                      No content keywords found.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Keyword Themes */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5" />
                  Keyword Themes
                </CardTitle>
                <CardDescription>
                  Grouped keywords by thematic relevance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(seoReport?.keywords?.keyword_themes || []).map(
                    (theme, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                      >
                        <h4 className="font-semibold text-sm mb-2">
                          {theme.theme}
                        </h4>

                        {/* Keywords in this theme */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {theme.keywords.map((kw, kwIndex) => (
                            <Badge
                              key={kwIndex}
                              variant="secondary"
                              className="text-xs"
                            >
                              {kw}
                            </Badge>
                          ))}
                        </div>

                        {/* Evidence for this theme */}
                        {theme.evidence && theme.evidence.length > 0 && (
                          <div className="space-y-2">
                            {theme.evidence
                              .slice(0, 1)
                              .map((evidence, evidenceIndex) => (
                                <div
                                  key={evidenceIndex}
                                  className="bg-muted/50 rounded p-2"
                                >
                                  <p className="text-xs text-muted-foreground mb-1 italic">
                                    &ldquo;{evidence.quote}&rdquo;
                                  </p>
                                  <div className="flex items-center justify-between text-xs">
                                    <a
                                      href={evidence.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline truncate flex-1 mr-2"
                                    >
                                      {new URL(evidence.url).hostname}
                                    </a>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {Math.round(
                                        evidence.relevance_score * 100
                                      )}
                                      % relevance
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            {theme.evidence.length > 1 && (
                              <p className="text-xs text-muted-foreground">
                                +{theme.evidence.length - 1} more sources
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  )}
                  {(!seoReport?.keywords?.keyword_themes ||
                    seoReport.keywords.keyword_themes.length === 0) && (
                    <p className="text-sm text-muted-foreground">
                      No keyword themes found.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Insights */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Strengths */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(seoReport?.summary?.key_strengths || []).map(
                    (strength, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    )
                  )}
                  {(!seoReport?.summary?.key_strengths ||
                    seoReport.summary.key_strengths.length === 0) && (
                    <li className="text-sm text-muted-foreground">
                      No strengths listed.
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Critical Issues */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Critical Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(seoReport?.summary?.critical_issues || []).map(
                    (issue, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        {issue}
                      </li>
                    )
                  )}
                  {(!seoReport?.summary?.critical_issues ||
                    seoReport.summary.critical_issues.length === 0) && (
                    <li className="text-sm text-muted-foreground">
                      No critical issues listed.
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Quick Wins */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <TrendingUp className="h-5 w-5" />
                  Quick Wins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(seoReport?.summary?.quick_wins || []).map((win, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      {win}
                    </li>
                  ))}
                  {(!seoReport?.summary?.quick_wins ||
                    seoReport.summary.quick_wins.length === 0) && (
                    <li className="text-sm text-muted-foreground">
                      No quick wins listed.
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Analysis */}
        <div className="mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Backlink Sources Analysis */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5" />
                  Backlink Sources
                </CardTitle>
                <CardDescription>
                  External sources linking to or mentioning the entity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(seoReport?.backlink_analysis?.backlink_sources || [])
                    .slice(0, 5)
                    .map((source, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm line-clamp-2">
                            {source.title}
                          </h4>
                          <Badge
                            variant={
                              source.source_type === "educational_citations"
                                ? "default"
                                : source.source_type === "press_coverage"
                                  ? "destructive"
                                  : source.source_type ===
                                      "professional_references"
                                    ? "secondary"
                                    : "outline"
                            }
                            className="text-xs ml-2"
                          >
                            {source.source_type.replace(/_/g, " ")}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {source.description}
                        </p>

                        <div className="flex items-center justify-between text-xs">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate flex-1 mr-2"
                          >
                            {source.domain}
                          </a>
                          {source.evidence && source.evidence.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {Math.round(
                                source.evidence[0].relevance_score * 100
                              )}
                              % relevance
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  {(!seoReport?.backlink_analysis?.backlink_sources ||
                    seoReport.backlink_analysis.backlink_sources.length ===
                      0) && (
                    <p className="text-sm text-muted-foreground">
                      No backlink sources found.
                    </p>
                  )}
                  {seoReport?.backlink_analysis?.backlink_sources &&
                    seoReport.backlink_analysis.backlink_sources.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +
                        {seoReport.backlink_analysis.backlink_sources.length -
                          5}{" "}
                        more sources
                      </p>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* Content Themes & Domain Analysis */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="h-5 w-5" />
                  Content Themes & Domains
                </CardTitle>
                <CardDescription>
                  Content themes and domain quality analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Content Themes */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">
                      Content Themes
                    </h4>
                    <div className="space-y-2">
                      {contentThemes.slice(0, 5).map((theme) => (
                        <div
                          key={theme.theme}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium truncate flex-1 mr-2">
                            {theme.theme}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {theme.frequency}
                          </Badge>
                        </div>
                      ))}
                      {contentThemes.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No content themes found.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Overall Sentiment */}
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">
                        Overall Sentiment
                      </h4>
                      <Badge
                        variant={
                          seoReport?.content_analysis?.sentiment?.overall ===
                          "positive"
                            ? "default"
                            : seoReport?.content_analysis?.sentiment
                                  ?.overall === "negative"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {seoReport?.content_analysis?.sentiment?.overall ||
                          "unknown"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Based on analysis of content themes and mentions
                    </p>
                  </div>

                  {/* Top Domains */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Top Domains</h4>
                    <div className="space-y-1">
                      {(seoReport?.inventory?.unique_domains || [])
                        .slice(0, 5)
                        .map((domain) => {
                          // Find sources from this domain to get quality scores
                          const domainSources = Object.values(
                            seoReport?.inventory?.source_types || {}
                          )
                            .flat()
                            .filter(
                              (source: { domain?: string }) =>
                                source.domain === domain
                            );
                          const avgQuality =
                            domainSources.length > 0
                              ? domainSources.reduce(
                                  (
                                    acc: number,
                                    source: { quality_score?: number }
                                  ) => acc + (source.quality_score || 0),
                                  0
                                ) / domainSources.length
                              : 0;

                          return (
                            <div
                              key={domain}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="truncate flex-1 mr-2">
                                {domain}
                              </span>
                              <div className="flex items-center gap-1">
                                <div className="w-8 h-1 bg-muted rounded">
                                  <div
                                    className="h-1 bg-primary rounded"
                                    style={{ width: `${avgQuality * 100}%` }}
                                  />
                                </div>
                                <span className="text-muted-foreground w-6">
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
        </div>
      </div>
    </div>
  );
}
