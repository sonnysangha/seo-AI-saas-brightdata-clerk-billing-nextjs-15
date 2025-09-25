"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  MessageCircle,
  TrendingUp,
  Zap,
  Crown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export function AIChatUpsellCard() {
  return (
    <Card className="border-none shadow-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/8 to-pink-500/10 relative overflow-hidden group hover:shadow-indigo-500/20 transition-all duration-500">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full -translate-y-20 translate-x-20 group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400/15 to-pink-400/15 rounded-full translate-y-16 -translate-x-16 group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-indigo-400/40 rounded-full animate-pulse" />
      <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-purple-400/50 rounded-full animate-pulse delay-1000" />
      <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-pink-400/40 rounded-full animate-pulse delay-500" />

      <CardContent className="p-8 lg:p-12 relative">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 px-4 py-2 text-sm">
                  <Crown className="h-4 w-4 mr-2" />
                  Pro Feature
                </Badge>
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI SEO Assistant
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Get instant, intelligent insights about your SEO report. Ask
                questions, discover opportunities, and receive personalized
                recommendations powered by advanced AI.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-indigo-100 dark:border-indigo-800/30">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Smart Analysis</p>
                  <p className="text-xs text-muted-foreground">
                    Context-aware insights
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-purple-100 dark:border-purple-800/30">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Actionable Tips</p>
                  <p className="text-xs text-muted-foreground">
                    Improve your rankings
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 group px-8 py-6 text-base h-auto"
              >
                <Link href="/pricing">
                  <Zap className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Upgrade to Pro
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 px-8 py-6 text-base h-auto"
              >
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
          </div>

          <div className="text-center lg:text-right relative">
            <div className="relative inline-block">
              {/* Chat bubble mockup */}
              <div className="relative">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 mb-4 border border-gray-100 dark:border-gray-800 max-w-sm ml-auto">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">AI Assistant</p>
                      <p className="text-xs text-muted-foreground">Just now</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    &ldquo;Your page load speed is affecting SEO. I recommend
                    optimizing images and enabling compression for a 40%
                    improvement.&rdquo;
                  </p>
                </div>

                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-md shadow-lg p-4 max-w-xs ml-auto">
                  <p className="text-sm">
                    &ldquo;How can I improve my site&rsquo;s performance?&rdquo;
                  </p>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles className="w-6 h-6 text-white" />
              </div>

              <div className="absolute -bottom-2 -left-4 w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
