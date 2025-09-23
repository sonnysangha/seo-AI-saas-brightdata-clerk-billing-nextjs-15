"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignInButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import {
  Search,
  MessageSquare,
  BarChart3,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by Bright Data & OpenAI
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Generate Beautiful
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SEO Reports
              </span>
              in Seconds
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Harness the power of Bright Data&apos;s SERP Perplexity Scraper to
              create comprehensive SEO reports instantly.
              <span className="text-foreground font-medium">
                {" "}
                Fast, simple, and incredibly insightful.
              </span>
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Unauthenticated>
                <SignInButton mode="modal">
                  <Button
                    size="lg"
                    className="text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <Search className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Generate My Report
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </SignInButton>
              </Unauthenticated>

              <Authenticated>
                <Button
                  size="lg"
                  className="text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Search className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Generate My Report
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Authenticated>

              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 py-6"
              >
                View Sample Report
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Choose Your SEO Superpower
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you&apos;re just getting started or need advanced
              insights, we&apos;ve got the perfect plan for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Starter Plan Card */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary">Starter</Badge>
                </div>
                <CardTitle className="text-2xl">Full SEO Reports</CardTitle>
                <CardDescription className="text-base">
                  Generate comprehensive SEO reports powered by Bright
                  Data&apos;s advanced SERP Perplexity Scraper technology.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Complete SERP analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Keyword ranking insights</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Competitor analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Export to PDF/CSV</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan Card */}
            <Card className="relative overflow-hidden border-2 border-primary/50 hover:border-primary transition-all duration-300 hover:shadow-2xl group bg-gradient-to-br from-primary/5 to-background">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full -translate-y-16 translate-x-16" />
              <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                <Sparkles className="w-3 h-3 mr-1" />
                Popular
              </Badge>
              <CardHeader className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <Badge>Pro</Badge>
                </div>
                <CardTitle className="text-2xl">
                  Chat With Your Report
                </CardTitle>
                <CardDescription className="text-base">
                  Everything in Starter, plus the power to have intelligent
                  conversations with your SEO data using GPT.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>All Starter features</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium">
                      AI-powered chat interface
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Ask questions about your data</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Get actionable recommendations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Priority support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your SEO needs. Upgrade or downgrade
              anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter Pricing */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-xl mb-2">Starter</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2">
                  Perfect for small businesses and individual marketers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">10 SEO reports per month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Bright Data SERP scraping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">PDF & CSV exports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Email support</span>
                  </div>
                </div>
                <Unauthenticated>
                  <SignInButton mode="modal">
                    <Button className="w-full mt-6" size="lg">
                      Subscribe to Starter
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                <Authenticated>
                  <Button className="w-full mt-6" size="lg">
                    Subscribe to Starter
                  </Button>
                </Authenticated>
              </CardContent>
            </Card>

            {/* Pro Pricing */}
            <Card className="border-primary hover:shadow-xl transition-all duration-300 relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                Most Popular
              </Badge>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-xl mb-2">Pro</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-2">
                  For agencies and power users who need AI insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Unlimited SEO reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Everything in Starter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">
                      AI Chat with reports
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Priority support</span>
                  </div>
                </div>
                <Unauthenticated>
                  <SignInButton mode="modal">
                    <Button className="w-full mt-6" size="lg">
                      Subscribe to Pro
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                <Authenticated>
                  <Button className="w-full mt-6" size="lg">
                    Subscribe to Pro
                  </Button>
                </Authenticated>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof / Trust Builders */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              Powered by Industry Leaders
            </h2>
            <p className="text-muted-foreground">
              Built with enterprise-grade technology and security you can trust
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-60 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Globe className="w-6 h-6" />
                Bright Data
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Zap className="w-6 h-6" />
                Vercel
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <MessageSquare className="w-6 h-6" />
                OpenAI
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Shield className="w-6 h-6" />
                Clerk
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                Enterprise-grade security & 99.9% uptime guaranteed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-background to-accent/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Start Generating SEO Insights Today
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of marketers who trust our platform to deliver
              actionable SEO insights. Get started in less than 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Unauthenticated>
                <SignInButton mode="modal">
                  <Button
                    size="lg"
                    className="text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <TrendingUp className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </SignInButton>
              </Unauthenticated>

              <Authenticated>
                <Button
                  size="lg"
                  className="text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <TrendingUp className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Create Your First Report
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Authenticated>

              <p className="text-sm text-muted-foreground">
                No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
