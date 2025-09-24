"use client";

import { testSeoAnalysis } from "@/lib/test-seo-analysis";
import { useState } from "react";

interface TestResults {
  systemPrompt?: string;
  analysisPrompt?: string;
  testDataValid?: boolean;
  schemaSections?: number;
  error?: string;
}

export default function TestSeoPage() {
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async () => {
    setIsRunning(true);
    try {
      const results = testSeoAnalysis();
      setTestResults(results);
    } catch (error) {
      console.error("Test failed:", error);
      setTestResults({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">SEO Analysis Test</h1>

      <div className="mb-6">
        <button
          onClick={runTest}
          disabled={isRunning}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isRunning ? "Running Test..." : "Run SEO Analysis Test"}
        </button>
      </div>

      {testResults && (
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>

          {testResults.error ? (
            <div className="text-red-600">
              <p>
                <strong>Error:</strong> {testResults.error}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">System Prompt Generated:</h3>
                <p className="text-green-600">
                  ✅ {testResults.systemPrompt ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Analysis Prompt Built:</h3>
                <p className="text-green-600">
                  ✅ {testResults.analysisPrompt ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Test Data Valid:</h3>
                <p className="text-green-600">
                  ✅ {testResults.testDataValid ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Schema Sections:</h3>
                <p className="text-blue-600">
                  {testResults.schemaSections} sections
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">System Prompt Preview:</h3>
                <pre className="bg-white p-4 rounded border text-sm overflow-auto max-h-40">
                  {testResults.systemPrompt?.substring(0, 500)}...
                </pre>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Analysis Prompt Preview:</h3>
                <pre className="bg-white p-4 rounded border text-sm overflow-auto max-h-40">
                  {testResults.analysisPrompt?.substring(0, 500)}...
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          How to Test the Full SEO Analysis
        </h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>1. Start your Convex dev server:</strong>{" "}
            <code>npx convex dev</code>
          </p>
          <p>
            <strong>2. Start your Next.js dev server:</strong>{" "}
            <code>npm run dev</code>
          </p>
          <p>
            <strong>3. Create a scraping job</strong> through your dashboard
          </p>
          <p>
            <strong>4. Send webhook data</strong> to trigger the SEO analysis
          </p>
          <p>
            <strong>5. Check the job results</strong> in your database
          </p>
        </div>
      </div>
    </div>
  );
}
