import { PricingTable } from "@clerk/nextjs";
import { Star } from "lucide-react";

function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Star className="size-4" />
            Choose Your Plan
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose the perfect plan for your needs. Start free and scale as you
            grow. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Table */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl blur-3xl" />
          <div className="relative bg-card/50 backdrop-blur-sm border rounded-2xl p-8 shadow-2xl">
            <PricingTable newSubscriptionRedirectUrl="/dashboard" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
