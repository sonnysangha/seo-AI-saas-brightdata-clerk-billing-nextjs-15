import {
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  HardDriveDownload,
} from "lucide-react";

export function getSpinnerColor(status: string): string {
  const statusConfig = {
    pending: "text-yellow-600 dark:text-yellow-400",
    running: "text-blue-600 dark:text-blue-400",
    analyzing: "text-purple-600 dark:text-purple-400",
  };

  return (
    statusConfig[status as keyof typeof statusConfig] || "text-muted-foreground"
  );
}

export function getProgressPercentage(status: string): string {
  const progressMap = {
    pending: "0%",
    running: "25%",
    analyzing: "75%",
    completed: "100%",
    failed: "Error",
  };

  return progressMap[status as keyof typeof progressMap] || "0%";
}

export function getProgressBarStyle(status: string): string {
  const styleMap = {
    pending: "w-0 bg-yellow-500",
    running: "w-1/4 bg-blue-500",
    analyzing: "w-3/4 bg-purple-500",
    completed: "w-full bg-green-500",
    failed: "w-full bg-red-500",
  };

  return styleMap[status as keyof typeof styleMap] || "w-0 bg-gray-500";
}

export function getReportTitle(status: string): string {
  switch (status) {
    case "completed":
      return "Report Ready!";
    case "failed":
      return "Report Failed";
    default:
      return "Generating Report";
  }
}

export function getStatusMessage(status: string): string {
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
}

export function getStatusConfig(status: string) {
  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending",
      variant: "secondary" as const,
      className:
        "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800 dark:hover:bg-yellow-900/30",
    },
    running: {
      icon: HardDriveDownload,
      label: "Scraping",
      variant: "secondary" as const,
      className:
        "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/30",
    },
    analyzing: {
      icon: BarChart3,
      label: "Analyzing",
      variant: "secondary" as const,
      className:
        "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900/30",
    },
    completed: {
      icon: CheckCircle,
      label: "Completed",
      variant: "default" as const,
      className:
        "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900/30",
    },
    failed: {
      icon: XCircle,
      label: "Failed",
      variant: "destructive" as const,
      className:
        "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/30",
    },
  };

  return (
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  );
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}
