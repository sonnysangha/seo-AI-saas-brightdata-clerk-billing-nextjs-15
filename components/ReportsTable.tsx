"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2, FileText, Plus, TrendingUp, Trash2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { formatDate, getSpinnerColor } from "@/lib/status-utils";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

export default function ReportsTable() {
  const jobs = useQuery(api.scrapingJobs.getUserJobs);
  const deleteJob = useMutation(api.scrapingJobs.deleteJob);
  const router = useRouter();
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  const handleRowClick = (snapshotId: string | undefined) => {
    if (snapshotId) {
      router.push(`/dashboard/report/${snapshotId}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation(); // Prevent row click

    if (
      !confirm(
        "Are you sure you want to delete this report? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingJobId(jobId);
    try {
      await deleteJob({ jobId: jobId as Id<"scrapingJobs"> });
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert("Failed to delete report. Please try again.");
    } finally {
      setDeletingJobId(null);
    }
  };

  if (!jobs) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="p-3 bg-muted/50 rounded-full mb-4">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Loading Reports</h3>
        <p className="text-muted-foreground">
          Fetching your latest analysis reports...
        </p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="p-4 bg-muted/50 rounded-full mb-6">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Reports Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Get started by creating your first SEO analysis report. Enter a
          business name, product, or website above to begin.
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Plus className="w-4 h-4" />
          <span>Create your first report to see it here</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-lg border bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50">
              <TableHead className="font-semibold text-foreground">
                Report
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Created
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Completed
              </TableHead>
              <TableHead className="font-semibold text-foreground w-20">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow
                key={job._id}
                className="cursor-pointer hover:bg-muted/30 transition-colors border-b border-border/30 last:border-b-0"
                onClick={() => handleRowClick(job.snapshotId)}
              >
                <TableCell className="font-medium py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-muted/50 rounded-md">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {(job.status === "pending" ||
                          job.status === "running" ||
                          job.status === "analyzing") && (
                          <Loader2
                            className={`w-4 h-4 animate-spin ${getSpinnerColor(job.status)}`}
                          />
                        )}
                        <span className="truncate font-medium text-foreground">
                          {job.originalPrompt}
                        </span>
                      </div>
                      {job.snapshotId && (
                        <p className="text-xs text-muted-foreground mt-1 font-mono">
                          ID: {job.snapshotId.slice(0, 8)}...
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <StatusBadge status={job.status} showIcon={true} />
                </TableCell>
                <TableCell className="py-4 text-muted-foreground">
                  {formatDate(job.createdAt)}
                </TableCell>
                <TableCell className="py-4 text-muted-foreground">
                  {job.completedAt ? (
                    formatDate(job.completedAt)
                  ) : (
                    <span className="text-muted-foreground/60">-</span>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDelete(e, job._id)}
                    disabled={deletingJobId === job._id}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    {deletingJobId === job._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span>
              {jobs.length} total report{jobs.length !== 1 ? "s" : ""}
            </span>
          </div>
          {jobs.filter((job) => job.status === "completed").length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>
                {jobs.filter((job) => job.status === "completed").length}{" "}
                completed
              </span>
            </div>
          )}
        </div>
        <div className="text-xs">Click any report to view details</div>
      </div>
    </div>
  );
}
