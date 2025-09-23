"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SEOReportDisplay } from "@/components/SEOReportDisplay";
import { ChatInterface } from "@/components/ChatInterface";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

function ReportPage({ params }: ReportPageProps) {
  const [id, setId] = useState<string>("");
  const [chatSessionId, setChatSessionId] = useState<Id<"chatSessions"> | undefined>();

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  // Get all jobs to find by snapshot ID
  const allJobs = useQuery(
    api.scrapingJobs.getUserJobs,
    id ? {} : "skip"
  );

  // Try to get job by ID as well
  const jobById = useQuery(
    api.scrapingJobs.getJobById,
    id ? { jobId: id as Id<"scrapingJobs"> } : "skip"
  );

  // Find the job with matching snapshot ID or use the direct job ID
  const job = allJobs?.find(j => j.snapshotId === id) || jobById;

  // Get existing chat sessions for this job
  const chatSessions = useQuery(
    api.chatSessions.getChatSessionsByJob,
    job?._id ? { jobId: job._id } : "skip"
  );

  useEffect(() => {
    // If there's an existing chat session, use the most recent one
    if (chatSessions && chatSessions.length > 0) {
      setChatSessionId(chatSessions[0]._id);
    }
  }, [chatSessions]);

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Report Not Found</h2>
        <p className="text-muted-foreground">
          The requested SEO report could not be found or is still being processed.
        </p>
      </div>
    );
  }

  if (job.status === "pending" || job.status === "running") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">Generating Report</h2>
        <p className="text-muted-foreground">
          Your SEO report is being generated. This usually takes 1-2 minutes.
        </p>
      </div>
    );
  }

  if (job.status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Report Generation Failed</h2>
        <p className="text-muted-foreground">
          {job.error || "An error occurred while generating the report."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
        {/* Report Display */}
        <div className="lg:col-span-2 overflow-auto">
          <SEOReportDisplay 
            report={job.seoReport} 
            originalPrompt={job.originalPrompt}
          />
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <ChatInterface 
              jobId={job._id}
              sessionId={chatSessionId}
              onSessionCreated={setChatSessionId}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
