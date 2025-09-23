"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Globe, 
  Target,
  BarChart3,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from "lucide-react";

interface SEOReportDisplayProps {
  report: any;
  originalPrompt: string;
}

export function SEOReportDisplay({ report, originalPrompt }: SEOReportDisplayProps) {
  if (!report) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Report Available</h3>
        <p className="text-muted-foreground">The SEO report is still being processed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">SEO Report</h1>
        <p className="text-muted-foreground">Analysis for: <span className="font-medium">{originalPrompt}</span></p>
      </div>

      {/* Meta Information */}
      {report.meta && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.meta.entity_type && (
                <div>
                  <p className="text-sm text-muted-foreground">Entity Type</p>
                  <p className="font-medium capitalize">{report.meta.entity_type}</p>
                </div>
              )}
              {report.meta.primary_domain && (
                <div>
                  <p className="text-sm text-muted-foreground">Primary Domain</p>
                  <p className="font-medium">{report.meta.primary_domain}</p>
                </div>
              )}
              {report.meta.analysis_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Analysis Date</p>
                  <p className="font-medium">{new Date(report.meta.analysis_date).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keywords */}
      {report.keywords && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Keywords Analysis
            </CardTitle>
            <CardDescription>
              Top performing and recommended keywords
            </CardDescription>
          </CardHeader>
          <CardContent>
            {report.keywords.top_keywords && report.keywords.top_keywords.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Top Keywords</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.keywords.top_keywords.slice(0, 10).map((keyword: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{keyword.keyword}</span>
                      <div className="flex items-center gap-2">
                        {keyword.search_volume && (
                          <Badge variant="secondary">{keyword.search_volume} searches</Badge>
                        )}
                        {keyword.difficulty && (
                          <Badge variant={keyword.difficulty > 70 ? "destructive" : keyword.difficulty > 40 ? "default" : "secondary"}>
                            {keyword.difficulty}% difficulty
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Competitors */}
      {report.competitors && report.competitors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Competitor Analysis
            </CardTitle>
            <CardDescription>
              Key competitors identified in your market
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.competitors.slice(0, 6).map((competitor: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{competitor.name}</h4>
                    {competitor.domain && (
                      <a 
                        href={`https://${competitor.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{competitor.description}</p>
                  <div className="flex gap-2">
                    {competitor.authority_score && (
                      <Badge variant="outline">Authority: {competitor.authority_score}</Badge>
                    )}
                    {competitor.estimated_traffic && (
                      <Badge variant="outline">Traffic: {competitor.estimated_traffic}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {report.recommendations && report.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Recommendations
            </CardTitle>
            <CardDescription>
              Actionable SEO improvements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.recommendations.slice(0, 10).map((rec: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`w-2 h-2 rounded-full ${
                        rec.priority === 'high' ? 'bg-red-500' :
                        rec.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      {rec.impact && (
                        <Badge variant="outline">
                          {rec.impact} impact
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SERP Overview */}
      {report.serp_overview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              SERP Analysis
            </CardTitle>
            <CardDescription>
              Search engine results page insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.serp_overview.top_results && report.serp_overview.top_results.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Top Search Results</h4>
                  <div className="space-y-2">
                    {report.serp_overview.top_results.slice(0, 5).map((result: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Badge variant="outline">#{result.position || index + 1}</Badge>
                        <div className="flex-1">
                          <h5 className="font-medium">{result.title}</h5>
                          <p className="text-sm text-muted-foreground">{result.url}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}