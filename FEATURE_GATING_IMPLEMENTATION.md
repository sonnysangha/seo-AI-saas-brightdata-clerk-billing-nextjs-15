# Feature Gating Implementation

This document explains the feature gating system implemented for the SEO SaaS application using Clerk billing.

## Overview

The feature gating system implements three subscription tiers:
- **Free**: No access to report generation
- **Starter**: 10 SEO reports per month
- **Pro**: Unlimited SEO reports + AI chatbot for report analysis

## Architecture

### 1. Database Schema (`convex/schema.ts`)

Added `userSubscriptions` table to track user subscription data:
```typescript
userSubscriptions: defineTable({
  userId: v.string(),
  plan: v.union(v.literal("free"), v.literal("starter"), v.literal("pro")),
  status: v.union(v.literal("active"), v.literal("canceled"), v.literal("past_due")),
  currentPeriodStart: v.number(),
  currentPeriodEnd: v.number(),
  reportsUsedThisMonth: v.number(),
  lastResetDate: v.number(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
```

Updated `scrapingJobs` table to include user association:
```typescript
scrapingJobs: defineTable({
  userId: v.string(),  // New field
  // ... existing fields
})
```

### 2. Subscription Management (`convex/subscriptions.ts`)

Core functions for managing user subscriptions:
- `createOrUpdateSubscription`: Creates/updates subscription from Clerk webhooks
- `cancelSubscription`: Cancels user subscription
- `getUserSubscription`: Retrieves current user subscription
- `initializeUserSubscription`: Creates free tier for new users

### 3. Feature Gating Logic (`convex/scrapingJobs.ts`)

Enhanced scraping job functions with subscription checks:
- `createScrapingJob`: Checks report limits before allowing job creation
- `getUserReportCount`: Returns usage stats for current billing period
- Helper functions for monthly usage reset and limit validation

### 4. Client-Side Hooks (`hooks/useSubscription.ts`)

React hook for accessing subscription data:
```typescript
const { plan, features, canAccessFeature, canGenerateReport } = useSubscription();
```

### 5. Feature Gate Components (`components/FeatureGate.tsx`)

Reusable components for gating features:
- `<FeatureGate feature="aiChatEnabled">`: Gates AI chat behind Pro plan
- `<ReportLimitGate currentReportsCount={count}>`: Gates report generation based on limits

### 6. Webhook Integration (`app/api/webhook/route.ts`)

Handles both Bright Data and Clerk webhooks:
- Bright Data: Updates scraping job results
- Clerk: Manages subscription lifecycle events

## Implementation Details

### Report Limit Enforcement

1. **Job Creation**: `createScrapingJob` checks `canUserGenerateReport()` before creating jobs
2. **Monthly Reset**: Automatically resets report count at the beginning of each month
3. **Usage Tracking**: Increments count when jobs are created (not when completed)

### AI Chat Feature Gating

1. **Component Level**: `<FeatureGate feature="aiChatEnabled">` wraps AI chat component
2. **Plan Check**: Only Pro users can access AI chat functionality
3. **Fallback UI**: Shows upgrade prompt for non-Pro users

### Subscription Initialization

1. **New Users**: Automatically get "free" subscription on first visit
2. **Middleware**: Protects dashboard routes, requires authentication
3. **Auto-initialization**: `SubscriptionInitializer` component ensures subscription exists

## Testing

### Test Component (`components/TestFeatureGating.tsx`)

Added test component to dashboard for easy plan switching during development:
- Buttons to switch between Free, Starter, and Pro plans
- Real-time display of current plan features
- Immediate feedback on feature availability

### Test Functions (`convex/testSubscriptions.ts`)

Helper mutation for creating test subscriptions during development.

## Configuration

### Environment Variables Required

```bash
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...  # For webhook verification

# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=https://...
CONVEX_DEPLOY_KEY=...

# Bright Data Configuration
BRIGHTDATA_API_KEY=...
```

### Clerk Dashboard Setup

1. **Pricing Plans**: Configure Starter and Pro plans in Clerk dashboard
2. **Webhooks**: Set up webhook endpoint for subscription events
3. **Pricing Table**: Configure `PricingTable` component with plan IDs

## Usage Examples

### Protecting Features

```typescript
// Gate AI chat behind Pro plan
<FeatureGate feature="aiChatEnabled">
  <AIChatPanel />
</FeatureGate>

// Gate report generation behind usage limits
<ReportLimitGate currentReportsCount={reportCount.used}>
  <ReportGenerationForm />
</ReportLimitGate>
```

### Checking Subscription Status

```typescript
const { plan, features, canAccessFeature } = useSubscription();

if (canAccessFeature('aiChatEnabled')) {
  // Show AI features
}

if (features.unlimitedReports) {
  // Show unlimited messaging
}
```

### Server-Side Checks

```typescript
// In Convex mutations
const canGenerate = await canUserGenerateReport(ctx, userId);
if (!canGenerate) {
  throw new ConvexError("Report limit reached");
}
```

## Key Features

✅ **Plan-based feature gating**: Different features for Free, Starter, and Pro
✅ **Usage tracking**: Monthly report limits with automatic reset
✅ **Real-time enforcement**: Server-side validation prevents bypassing
✅ **Webhook integration**: Automatic subscription updates from Clerk
✅ **Graceful fallbacks**: Upgrade prompts instead of broken features
✅ **Test utilities**: Easy plan switching for development/testing

## Future Enhancements

- [ ] Usage analytics dashboard
- [ ] Overage billing for Starter plan
- [ ] Team/organization subscriptions
- [ ] API rate limiting based on plan
- [ ] Advanced AI features for enterprise plans