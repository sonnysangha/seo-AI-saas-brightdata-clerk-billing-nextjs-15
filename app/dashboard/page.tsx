"use client";

import startScraping from "@/actions/startScraping";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportLimitGate } from "@/components/FeatureGate";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, BarChart3, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { SubscriptionInitializer } from "@/components/SubscriptionInitializer";
import { TestFeatureGating } from "@/components/TestFeatureGating";

function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const reportCount = useQuery(api.scrapingJobs.getUserReportCount);
  const userJobs = useQuery(api.scrapingJobs.getUserJobs);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt || isLoading) return;

    setIsLoading(true);
    try {
      const response = await startScraping(prompt);
      if (response.ok) {
        console.log(response.data);
        const snapshotId = response.data.snapshot_id;
        router.push(`/dashboard/report/${snapshotId}`);
      } else {
        console.error(response.error);
        alert(response.error);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "running":
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "running":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  if (!reportCount) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SubscriptionInitializer>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">SEO Reports Dashboard</h1>
          </div>
          
          {/* Usage Stats */}
          <div className="flex items-center justify-center gap-4">
            <Badge variant="secondary" className="text-sm">
              Plan: {reportCount.plan.charAt(0).toUpperCase() + reportCount.plan.slice(1)}
            </Badge>
            <Badge variant={reportCount.limit === -1 ? "default" : "outline"} className="text-sm">
              Reports: {reportCount.limit === -1 ? `${reportCount.used} (Unlimited)` : `${reportCount.used}/${reportCount.limit}`}
            </Badge>
          </div>
        </div>

        {/* Test Feature Gating */}
        <TestFeatureGating />

        {/* Report Generation Form */}
        <ReportLimitGate currentReportsCount={reportCount.used}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Generate New SEO Report
              </CardTitle>
              <CardDescription>
                Enter a business name, website, product, or person to generate a comprehensive SEO analysis report.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter a Name / Business / Product / Website etc."
                  disabled={isLoading}
                  className="text-lg"
                />
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading || !prompt.trim()}
                >
                  {isLoading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </ReportLimitGate>

        {/* Recent Reports */}
        {userJobs && userJobs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Your generated SEO reports and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userJobs.slice(0, 10).map((job) => (
                  <div
                    key={job._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <p className="font-medium">{job.originalPrompt}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(job.createdAt).toLocaleDateString()} at{" "}
                          {new Date(job.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      {job.status === "completed" && job.snapshotId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/report/${job.snapshotId}`)}
                        >
                          View Report
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </SubscriptionInitializer>
  );
}

export default Dashboard;
