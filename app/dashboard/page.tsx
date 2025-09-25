"use client";

import startScraping from "@/actions/startScraping";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, BarChart3, FileText, Sparkles, Loader2 } from "lucide-react";
import ReportsTable from "@/components/ReportsTable";
import { CountrySelector } from "@/components/ui/country-selector";
import { Authenticated, AuthLoading } from "convex/react";

function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [country, setCountry] = useState("US");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt || isLoading) return;

    setIsLoading(true);
    try {
      const response = await startScraping(prompt, undefined, country);
      if (response.ok) {
        console.log(response.data);
        const snapshotId = response.data.snapshot_id;
        router.push(`/dashboard/report/${snapshotId}`);
      } else {
        console.error(response.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Create Report Section */}
          <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-pink-950/50 backdrop-blur-sm">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full -translate-y-20 translate-x-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400/15 to-blue-400/15 rounded-full translate-y-16 -translate-x-16" />

            <CardHeader className="text-center pb-6 relative">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                  <Sparkles className="w-6 h-6" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Create New Report
                </CardTitle>
              </div>
              <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Enter a business name, product, or website to generate a
                <span className="font-semibold text-foreground">
                  {" "}
                  comprehensive SEO analysis
                </span>{" "}
                powered by AI
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1 rounded-md bg-blue-100 dark:bg-blue-900/30 z-10">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <Input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter a Name / Business / Product / Website etc."
                      className="pl-14 h-14 text-base border-2 border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm w-full"
                      disabled={isLoading}
                    />
                  </div>

                  <CountrySelector
                    value={country}
                    onValueChange={setCountry}
                    disabled={isLoading}
                  />

                  <div>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-14 px-6 md:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 border-0 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 group font-semibold w-full md:w-auto"
                      disabled={isLoading || !prompt.trim()}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-3" />
                          <span className="hidden lg:inline">
                            Generating Report...
                          </span>
                          <span className="lg:hidden">Generating...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                          <span className="hidden lg:inline">
                            Generate Report
                          </span>
                          <span className="lg:hidden">Generate</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Feature highlights */}
                <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-blue-200/50 dark:border-blue-800/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>AI-Powered Analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Real-time Data</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>Comprehensive Insights</span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Reports Section */}
          <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <CardTitle className="text-2xl">Recent Reports</CardTitle>
              </div>
              <CardDescription>
                Track the progress of your SEO analysis reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Authenticated>
                <ReportsTable />
              </Authenticated>
              <AuthLoading>
                <div className="flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                </div>
              </AuthLoading>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
