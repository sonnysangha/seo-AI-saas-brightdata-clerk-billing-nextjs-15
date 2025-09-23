"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureGate } from "@/components/FeatureGate";
import { ArrowLeft, MessageSquare, BarChart3, Clock, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { use } from "react";

// AI Chat Component (Pro feature)
function AIChatPanel({ reportData }: { reportData: any }) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Here you would integrate with your AI service
      // For now, we'll simulate a response
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: `I understand you're asking about "${userMessage}". Based on the SEO report data, I can provide insights about the analyzed entity. This is a simulated response - in a real implementation, this would analyze the report data using GPT or another AI service.`
          }
        ]);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Chat error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          AI Chat Assistant
        </CardTitle>
        <CardDescription>
          Ask questions about this SEO report and get AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/20 rounded-lg">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation about this SEO report!</p>
              <p className="text-sm">Try asking: "What are the main SEO opportunities?" or "How does this compare to competitors?"</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this SEO report..."
            className="flex-1 px-3 py-2 border rounded-md"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const userJobs = useQuery(api.scrapingJobs.getUserJobs);
  
  // Find the job with matching snapshot ID
  const job = userJobs?.find(j => j.snapshotId === id);

  if (!userJobs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
        <div className="max-w-6xl mx-auto text-center py-16">
          <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Report Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The report you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "running":
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-primary" />
                SEO Report
              </h1>
              <p className="text-muted-foreground">{job.originalPrompt}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(job.status)}
            <Badge className={getStatusColor(job.status)}>
              {job.status}
            </Badge>
          </div>
        </div>

        {/* Report Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Report Data */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Details</CardTitle>
                <CardDescription>
                  Generated on {new Date(job.createdAt).toLocaleDateString()} at{" "}
                  {new Date(job.createdAt).toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {job.status === "completed" && job.results ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Report Summary</h4>
                      <p className="text-sm text-muted-foreground">
                        SEO analysis completed successfully. The report contains comprehensive
                        insights about search visibility, keyword opportunities, and competitive analysis.
                      </p>
                    </div>
                    
                    {/* Here you would render the actual report data */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Raw Data</h4>
                      <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-64">
                        {JSON.stringify(job.results, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : job.status === "failed" ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                    <h3 className="font-medium mb-2">Report Generation Failed</h3>
                    <p className="text-sm text-muted-foreground">
                      {job.error || "An error occurred while generating the report."}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 mx-auto text-blue-500 animate-spin mb-4" />
                    <h3 className="font-medium mb-2">Generating Report...</h3>
                    <p className="text-sm text-muted-foreground">
                      This usually takes 1-3 minutes. You can refresh this page to check for updates.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Chat Panel - Gated behind Pro */}
          <div>
            <FeatureGate feature="aiChatEnabled">
              <AIChatPanel reportData={job.results} />
            </FeatureGate>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
