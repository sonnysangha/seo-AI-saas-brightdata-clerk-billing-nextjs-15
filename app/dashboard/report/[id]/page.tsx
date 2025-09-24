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
import {
  Loader2,
  CheckCircle,
  XCircle,
  BarChart3,
  Calendar,
  FileText,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import {
  getSpinnerColor,
  getProgressPercentage,
  getProgressBarStyle,
  getReportTitle,
  getStatusMessage,
  formatDateTime,
} from "@/lib/status-utils";

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
                <StatusBadge status={job.status} showIcon={true} />
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
                        {formatDateTime(job.createdAt)}
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
                        {formatDateTime(job.completedAt)}
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
              <Link href={`/dashboard/report/${id}/summary`}>
                <Button variant="default" size="lg" className="cursor-pointer">
                  View Full Report
                </Button>
              </Link>
            )}

            {job.status === "failed" && (
              <Button variant="default" size="lg" className="cursor-pointer">
                Retry Report
              </Button>
            )}

            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="cursor-pointer">
                Back to Dashboard
              </Button>
            </Link>
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
