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
import {
  Clock,
  Loader2,
  CheckCircle,
  XCircle,
  BarChart3,
  Calendar,
  FileText,
  AlertCircle,
} from "lucide-react";

function getSpinnerColor(status: string): string {
  const statusConfig = {
    pending: "text-yellow-600 dark:text-yellow-400",
    running: "text-blue-600 dark:text-blue-400",
    analyzing: "text-purple-600 dark:text-purple-400",
  };

  return (
    statusConfig[status as keyof typeof statusConfig] || "text-muted-foreground"
  );
}

function getProgressPercentage(status: string): string {
  const progressMap = {
    pending: "0%",
    running: "25%",
    analyzing: "75%",
    completed: "100%",
    failed: "Error",
  };

  return progressMap[status as keyof typeof progressMap] || "0%";
}

function getProgressBarStyle(status: string): string {
  const styleMap = {
    pending: "w-0 bg-yellow-500",
    running: "w-1/4 bg-blue-500",
    analyzing: "w-3/4 bg-purple-500",
    completed: "w-full bg-green-500",
    failed: "w-full bg-red-500",
  };

  return styleMap[status as keyof typeof styleMap] || "w-0 bg-gray-500";
}

function getReportTitle(status: string): string {
  return status === "completed" ? "Report Ready!" : "Generating Report";
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending",
      variant: "secondary" as const,
      className:
        "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
    },
    running: {
      icon: Loader2,
      label: "Scraping",
      variant: "secondary" as const,
      className:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    },
    analyzing: {
      icon: BarChart3,
      label: "Analyzing",
      variant: "secondary" as const,
      className:
        "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
    },
    completed: {
      icon: CheckCircle,
      label: "Completed",
      variant: "default" as const,
      className:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    },
    failed: {
      icon: XCircle,
      label: "Failed",
      variant: "destructive" as const,
      className:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}

function ReportStatus({ id }: { id: string }) {
  const job = useQuery(api.scrapingJobs.getJobBySnapshotId, { snapshotId: id });

  if (job === undefined) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-muted-foreground">
            Loading report status...
          </span>
        </CardContent>
      </Card>
    );
  }

  if (job === null) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <AlertCircle className="w-6 h-6 text-destructive mr-2" />
          <span className="text-destructive">Report not found</span>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return "Your report is queued and will start processing shortly.";
      case "running":
        return "We're scraping data from search engines. This may take a few minutes.";
      case "analyzing":
        return "We're analyzing your data and generating AI insights. This may take a few more minutes.";
      case "completed":
        return "Your report is ready! You can now view and download your SEO insights.";
      case "failed":
        return "There was an error processing your report. Please try again.";
      default:
        return "Unknown status";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Report Status
            </h1>
            <p className="text-lg text-muted-foreground">
              Track the progress of your SEO report generation
            </p>
          </div>

          {/* Status Card */}
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex flex-col items-center justify-center mb-4">
                {(job.status === "pending" ||
                  job.status === "running" ||
                  job.status === "analyzing") && (
                  <Loader2
                    className={`w-5 h-5 animate-spin mb-2 ${getSpinnerColor(job.status)}`}
                  />
                )}
                <StatusBadge status={job.status} />
              </div>
              <CardTitle className="text-xl">
                {getReportTitle(job.status)}
              </CardTitle>
              <CardDescription className="text-base">
                {getStatusMessage(job.status)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Indicator */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {getProgressPercentage(job.status)}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressBarStyle(job.status)}`}
                  />
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Original Query</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {job.originalPrompt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(job.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {job.completedAt && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Completed</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(job.completedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {job.snapshotId && (
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Snapshot ID</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {job.snapshotId}
                      </p>
                    </div>
                  </div>
                )}

                {job.error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">
                          Error Details
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                          {job.error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Results Preview */}
              {job.status === "completed" &&
                job.results &&
                job.results.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Results Available
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Your SEO report contains {job.results.length} data
                        points and is ready for analysis.
                      </p>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {job.status === "completed" && (
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                View Full Report
              </button>
            )}

            {job.status === "failed" && (
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Retry Report
              </button>
            )}

            <button className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors font-medium">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  return <ReportStatusWrapper params={params} />;
}

function ReportStatusWrapper({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = React.useState<string | null>(null);

  React.useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  if (!id) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-muted-foreground">Loading...</span>
        </CardContent>
      </Card>
    );
  }

  return <ReportStatus id={id} />;
}

export default ReportPage;
