# SEO Reports Generator — Powered by Bright Data & AI (Next.js 15 + Clerk + Convex + OpenAI)

A comprehensive SEO analysis platform that generates beautiful, data-driven reports in seconds. Built with Next.js 15, Clerk authentication, Convex backend, and powered by Bright Data's SERP Perplexity Scraper with AI-powered analysis.

## 👇🏼 DO THIS Before you get started

> Note: Using the referral links below helps support the development of this project through affiliate partnerships, allowing me to provide these tutorials for free!

### 1) Set up Clerk

Create a Clerk account at [Clerk](https://go.clerk.com/jwRmKlC)

### 2) Set up Convex

Create a Convex account at [Convex](https://convex.dev)

### 3) Set up Bright Data

Create a Bright Data account at [Bright Data](https://brightdata.com) for SERP scraping

### 4) Set up OpenAI

Create an OpenAI account at [OpenAI](https://openai.com) for AI analysis

## Features

### For Users

- **Instant SEO Reports**: Generate comprehensive SEO analysis in seconds using AI
- **Entity Analysis**: Analyze businesses, people, products, courses, or websites
- **AI Chat Integration**: Chat with your reports using OpenAI GPT-4o (Pro plan)
- **Comprehensive Data**: Source inventory, competitor analysis, keyword research, backlink analysis
- **Real-time Progress**: Track report generation with live status updates
- **Beautiful Dashboard**: Modern, responsive UI with detailed visualizations

### Technical Features

- **Next.js 15 (App Router)** with React 19 and Turbopack
- **Clerk** for authentication and user management with Pro plan protection
- **Convex** for serverless backend, real-time data, and job management
- **Bright Data** SERP Perplexity Scraper for comprehensive web data collection
- **OpenAI GPT-4o** for AI-powered analysis and structured report generation
- **TypeScript** end-to-end with Zod validation
- **Radix UI + Tailwind v4** for modern, accessible components

### AI & Data Processing

- **Smart Web Scraping** using Bright Data's Perplexity integration
- **Structured AI Analysis** with Zod schema validation
- **Background Processing** with Convex schedulers for long-running tasks
- **Smart Retry Logic** for failed analyses without re-scraping
- **Evidence-Based Reports** with source attribution and quotes

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- Accounts: Clerk, Convex, Bright Data, OpenAI

### 1) Clone & Install

```bash
pnpm install
# or
npm install
```

### 2) Environment Variables

Create a `.env.local` file in the project root with the following:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex Backend
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
NEXT_PUBLIC_CONVEX_SITE_URL=your_site_url_for_webhooks

# Bright Data SERP Scraping
BRIGHTDATA_API_KEY=your_brightdata_api_key

# OpenAI for AI Analysis
OPENAI_API_KEY=your_openai_api_key
```

Notes:

- `NEXT_PUBLIC_CONVEX_URL` is required by `ConvexHttpClient` for database operations
- `NEXT_PUBLIC_CONVEX_SITE_URL` is used for webhook endpoints from Bright Data
- `BRIGHTDATA_API_KEY` enables SERP scraping via Bright Data's Perplexity dataset
- `OPENAI_API_KEY` powers the AI analysis and chat features

### 3) Configure Clerk

1. Create a new application in Clerk
2. Enable Email and Google as providers (optional)
3. Copy the Publishable Key and Secret Key into `.env.local`
4. For Convex auth: set up a JWT Template named `convex` (or update `convex/auth.config.ts`)
5. Configure Pro plan pricing if using AI chat features
6. In production, configure authorized redirect/callback URLs in Clerk

### 4) Configure Convex

1. Create a Convex project
2. In project settings, copy the Deployment URL and set `NEXT_PUBLIC_CONVEX_URL`
3. Push the schema and functions:

```bash
npx convex dev
# this runs a local dev deployment and watches for changes
```

The app includes these Convex functions:

- **scrapingJobs.ts**: Job management, status tracking, and data storage
- **analysis.ts**: AI-powered report generation using OpenAI
- **http.ts**: Webhook endpoint for Bright Data scraping results
- **auth.config.ts**: Clerk JWT integration for user authentication

### 5) Configure Bright Data

1. Create a Bright Data account
2. Access the SERP Perplexity Scraper dataset (dataset_id: `gd_m7dhdot1vw9a7gc1n`)
3. Copy your API key and add to `.env.local` as `BRIGHTDATA_API_KEY`
4. Ensure webhook endpoints are properly configured for your domain

### 6) Configure OpenAI

1. Create an OpenAI account
2. Generate an API key
3. Add to `.env.local` as `OPENAI_API_KEY`
4. Ensure you have access to GPT-4o model for best results

### 7) Run the App

Development mode runs both Next.js and Convex:

```bash
pnpm dev
# or
npm run dev
```

- Next.js dev server: `http://localhost:3000`
- Convex dev server runs concurrently and watches for changes

## Project Structure

- `app/` — App Router pages and layouts
  - `page.tsx` — Marketing homepage with features and pricing
  - `dashboard/` — Protected dashboard area
    - `page.tsx` — Main dashboard with report creation and management
    - `report/[id]/` — Individual report pages
      - `page.tsx` — Report status and loading states
      - `summary/` — Detailed report analysis
        - `page.tsx` — Main summary page with all components
        - `ui/` — Report visualization components
  - `api/chat/` — AI chat API endpoint
- `components/` — UI components, chat interface, and providers
  - `ConvexProviderWithClerk.tsx` — Convex + Clerk integration
  - `AIChat.tsx` — Chat interface for Pro users
  - `ReportsTable.tsx` — Dashboard reports listing
  - `ui/` — Reusable UI components
- `convex/` — Convex backend functions and schema
  - `schema.ts` — Database schema for scraping jobs
  - `scrapingJobs.ts` — Job management functions
  - `analysis.ts` — AI analysis workflows
  - `http.ts` — Webhook handlers for Bright Data
  - `auth.config.ts` — Clerk authentication configuration
- `actions/` — Server actions for form handling
  - `startScraping.ts` — Initiate scraping jobs
  - `retryAnalysis.ts` — Smart retry logic
- `prompts/` — AI prompt engineering
  - `perplexity.ts` — Scraping prompts for Bright Data
  - `gpt.ts` — Analysis prompts for OpenAI
- `lib/` — Utilities, schemas, and helpers
  - `seo-schema.ts` — Zod validation schemas for reports
  - `seo-utils.ts` — SEO analysis utilities
- `middleware.ts` — Protects dashboard routes with Clerk

## How It Works

### Data Flow

1. **User Input**: User enters entity name and selects country on dashboard
2. **Job Creation**: `startScraping` action creates job record in Convex
3. **Web Scraping**: Bright Data's SERP Perplexity Scraper collects comprehensive data
4. **Webhook Processing**: Raw data received via `/api/webhook` endpoint
5. **AI Analysis**: OpenAI GPT-4o processes data using structured prompts
6. **Report Generation**: Validated SEO report stored and displayed
7. **AI Chat**: Pro users can chat with reports using contextual AI

### Authentication & Authorization

- **Auth (Clerk)**: `middleware.ts` protects `/dashboard(.*)` routes
- **User Sync**: Convex automatically syncs Clerk users
- **Plan Protection**: AI chat features restricted to Pro plan users

### Background Processing

- **Async Jobs**: Long-running analysis tasks use Convex schedulers
- **Smart Retry**: Failed analyses can retry without re-scraping data
- **Real-time Updates**: Dashboard shows live job status updates

### AI Features

- **Structured Analysis**: Uses Zod schemas for consistent report format
- **Evidence-Based**: All insights backed by source quotes and URLs
- **Contextual Chat**: AI assistant understands full report context
- **Web Search Integration**: Chat can perform additional web searches

## Scripts

- `pnpm dev` — Start Next.js with Turbopack and Convex dev
- `pnpm build` — Build Next.js application
- `pnpm start` — Start production server
- `pnpm lint` — Run ESLint

## Common Issues

- **Missing Environment Variables**: Check all required env vars are set in `.env.local`
- **Clerk JWT Setup**: Ensure JWT template named `convex` exists in Clerk
- **Bright Data Webhooks**: Verify webhook URLs are accessible from Bright Data
- **OpenAI Rate Limits**: Monitor API usage and upgrade plan if needed
- **Convex Schema**: Run `npx convex dev` to sync schema changes

## Tech Stack Deep Dive

### Frontend

- **Next.js 15** with App Router and React 19
- **Tailwind CSS v4** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons
- **React Markdown** for chat message rendering

### Backend

- **Convex** for serverless functions and real-time data
- **Clerk** for authentication and user management
- **Zod** for runtime type validation

### AI & Data

- **OpenAI GPT-4o** for analysis and chat
- **Bright Data** for web scraping
- **AI SDK** for streaming chat responses

### DevOps

- **TypeScript** for type safety
- **ESLint** for code quality
- **Turbopack** for fast development builds

## Join the worlds best developer course & community Zero to Full Stack Hero! 🚀

Learn modern full-stack and AI-powered app development with Sonny Sangha and the PAPAFAM community. Build real projects like this and more.

[Join Zero to Full Stack Hero](https://www.papareact.com/course)

## 🏆 Take It Further - Challenge Time!

- Add more data sources beyond Perplexity
- Implement competitor monitoring with alerts
- Add team collaboration and report sharing
- Build custom report templates and branding
- Integrate with Google Analytics and Search Console
- Add automated scheduled reports
- Implement advanced filtering and search
- Add export functionality (PDF, Excel)

## Support

For support, email team@papareact.com

Built with ❤️ for the PAPAFAM
