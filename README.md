# SEO Reports Generator SaaS — Powered by Bright Data & AI (Next.js 15 + Clerk + Convex + OpenAI)

A comprehensive SEO analysis platform that generates beautiful, data-driven reports. Built with Next.js 15, Clerk authentication, Convex backend, and powered by Bright Data's Perplexity Scraper with OpenAI GPT powered analysis.

## 👇🏼 DO THIS Before you get started

> Note: Using the referral links below helps support the development of this project through affiliate partnerships, allowing me to provide these tutorials for free! (You also get FREE Credits and $20 in BrightData)

### 0) Get the Entire FREE Source Code

Get the complete code for **FREE** here --> [SOURCE CODE](https://www.papareact.com/ai-marketing-saas-form)

### 1) Set up Clerk

Create a Clerk account at [Clerk](https://go.clerk.com/PcP73s8)

### 2) Set up Bright Data (**$20 Free Credit**)

Create a Bright Data account at [Bright Data](https://brdta.com/papafam) for Scraping

### 3) Set up Convex

Create a Convex account at [Convex](https://convex.dev)

### 4) Set up OpenAI

Create an OpenAI account at [OpenAI](https://openai.com) for AI analysis

## Features

### For Users

- **Instant SEO Reports**: Generate comprehensive SEO analysis in seconds using AI
- **Entity Analysis**: Analyze businesses, people, products, courses, or websites
- **AI Chat Integration**: Chat with your reports using OpenAI GPT-4o (you can change the model in the code) (Pro plan)
- **Comprehensive Data**: Source inventory, competitor analysis, keyword research, backlink analysis
- **Real-time Progress**: Track report generation with live status updates
- **Beautiful Dashboard**: Modern, responsive UI with detailed visualizations

### Technical Features

- **Next.js 15 (App Router)** with React 19 and Turbopack
- **Clerk** for authentication and user management with **Clerk Billing** for subscription management (Stripe-powered) and feature gating between Starter/Pro plans
- **Convex** for serverless backend, real-time data, and job management
- **Bright Data** SERP & Perplexity Scraper for comprehensive web data collection
- **OpenAI GPT-4o** for AI-powered analysis and structured report generation
- **TypeScript** end-to-end with Zod validation
- **shadcn/ui + Radix UI + Tailwind v4** for modern, accessible components

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
- `BRIGHTDATA_API_KEY` enables scraping via Bright Data's API's
- `OPENAI_API_KEY` powers the AI analysis and chat features

### 3) Configure Clerk

1. Create a new application at [Clerk](https://go.clerk.com/PcP73s8)
2. Enable Email and Google as providers (optional)
3. Copy the Publishable Key and Secret Key into `.env.local`
4. For Convex auth: set up a JWT Template named `convex` (or update `convex/auth.config.ts`)
5. Set up Clerk Billing with Stripe integration for subscription management
6. Configure Starter and Pro plan pricing with feature gating for AI chat
7. In production, configure authorized redirect/callback URLs in Clerk

### 4) Configure Bright Data

1. Create a Bright Data account at [Bright Data](https://brdta.com/papafam) (**$20 Free Credit**)
2. Access the SERP Perplexity Scraper dataset (dataset_id: `gd_m7dhdot1vw9a7gc1n`)
3. Copy your API key and add to `.env.local` as `BRIGHTDATA_API_KEY`
4. Ensure webhook endpoints are properly configured for your domain

### 5) Configure Convex

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
  - `http.ts` — Webhook handlers for Bright Data (includes /api/webhook POST endpoint)
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
3. **Web Scraping**: Bright Data's Perplexity Scraper collects comprehensive data
4. **Webhook Processing**: Raw data received via `/api/webhook` convex endpoint
5. **AI Analysis**: OpenAI GPT-4o (or model you choose in code) processes data using structured prompts
6. **Report Generation**: Validated SEO report stored and displayed
7. **AI Chat**: Pro users can chat with reports using contextual AI

### Authentication & Authorization

- **Auth (Clerk)**: `middleware.ts` protects `/dashboard(.*)` routes
- **Billing (Clerk + Stripe)**: Handles subscription management with Starter/Pro tiers
- **Feature Gating**: AI chat and advanced features restricted to Pro plan subscribers

### Background Processing

- **Async Jobs**: Long-running analysis tasks use Convex schedulers
- **Smart Retry**: Failed analyses can retry without re-scraping data
- **Real-time Updates**: Dashboard shows live job status updates

### AI Features

- **Structured Analysis**: Uses Zod schemas for consistent report format
- **Evidence-Based**: All insights backed by source quotes and URLs
- **Contextual Chat**: AI assistant understands full report context
- **Web Search Integration**: Chat can perform additional web searches

## Common Issues

- **Missing Environment Variables**: Check all required env vars are set in `.env.local`
- **Clerk JWT Setup**: Ensure JWT template named `convex` exists in Clerk
- **Webhooks**: Verify webhook URLs are accessible using a tool such as Postman
- **OpenAI Rate Limits**: Monitor API usage and upgrade plan if needed
- **Convex Schema**: Run `npx convex dev` to sync schema changes
- **Bright Data Credits**: Ensure sufficient Bright Data credits or test credits are available

## Tech Stack Deep Dive

### Frontend

- **Next.js 15** with App Router and React 19
- **Tailwind CSS** for styling
- **shadcn/ui** for beautiful, customizable UI components
- **Radix UI** for accessible primitives
- **Lucide React** for icons
- **React Markdown** for chat message rendering

### Backend

- **Convex** for serverless functions and real-time data
- **Clerk** for authentication and user management
- **Zod** for runtime type validation

### AI & Data

- **OpenAI GPT** for analysis and chat
- **Bright Data** for web scraping
- **Vercel AI SDK** for type-safe AI completions and real-time streaming chat responses

## 🚀 Join the World's Best Developer Course & Community - Zero to Full Stack Hero!

### Transform Your Career with Modern Full-Stack Development

Ready to build production-ready applications like this SEO Reports Generator? Join **Zero to Full Stack Hero** - the ultimate course that teaches you to build real-world, revenue-generating applications using the latest technologies.

### 🎯 What You'll Learn:

- **Next.js 15 & React 19** - Master the latest features and App Router
- **AI Integration** - Build intelligent apps with OpenAI, Claude, and custom AI workflows
- **Full-Stack Architecture** - From frontend to backend, databases to deployment
- **Modern Authentication** - Clerk, Auth0, and custom auth solutions
- **Database Mastery** - SQL, NoSQL, Prisma, Convex, and more
- **Payment Integration** - Stripe, subscription models, and billing systems
- **Real-Time Features** - WebSockets, live updates, and collaborative apps
- **Deployment & DevOps** - Vercel, AWS, Docker, and CI/CD pipelines

### 🏗️ Build 12+ Production Apps Including:

- **AI-Powered SaaS Platforms** (like this SEO tool)
- **E-commerce Marketplaces** with payment processing
- **Social Media Applications** with real-time features
- **Productivity Tools** with team collaboration
- **Data Analytics Dashboards** with beautiful visualizations
- **Mobile Apps** with React Native and Expo

### 👥 Join the PAPAFAM Community:

- **1,000+ Active Developers** helping each other succeed
- **Weekly Live Coding Sessions** with Sonny Sangha
- **Code Reviews & Feedback** from industry professionals
- **Job Placement Support** and career guidance
- **Exclusive Discord Community** with 24/7 support
- **Networking Opportunities** with like-minded developers

### 💼 Career Transformation:

- **$50k-$150k+ Salary Increases** reported by graduates
- **Portfolio Projects** that impress employers
- **Interview Preparation** and technical assessment practice
- **Freelancing Guidance** to start your own business
- **Lifetime Access** to all course materials and updates

### 🎁 Special Bonuses:

- **100+ Hours** of premium video content
- **Private GitHub Repositories** with complete source code
- **Exclusive Templates & Boilerplates** to accelerate development
- **Monthly Q&A Sessions** with industry experts
- **Certificate of Completion** to showcase your skills

---

**Ready to level up your development skills and build the future?**

[🚀 **Join Zero to Full Stack Hero NOW**](https://www.papareact.com/course)

_Join thousands of developers who've transformed their careers with PAPAFAM!_

## 🏆 Take It Further - Challenge Time!

- Add more data sources beyond Perplexity such as Brightdata's SERP Scraper! (will pull data using Google!)
- Implement competitor monitoring with alerts
- Add team collaboration and report sharing
- Build custom report templates and branding
- Integrate with Google Analytics and Search Console
- Add automated scheduled reports
- Implement advanced filtering and search
- Add export functionality (PDF, Excel)

## 📄 License & Commercial Use

This project is provided for **educational and learning purposes only**.

### 🚨 Important Licensing Information:

- **Personal Learning**: You are free to use this code for personal learning, experimentation, and portfolio demonstration
- **Commercial Use**: Any commercial use, redistribution, or deployment of this code requires **explicit written permission** from Sonny Sangha
- **No Resale**: You may not sell, redistribute, or claim ownership of this codebase
- **Attribution Required**: If showcasing this project, proper attribution to Sonny Sangha and the original tutorial must be included

### 📧 For Commercial Licensing:

If you wish to use this code commercially or have licensing questions, please contact us at **team@papareact.com** with details about your intended use case.

**Violation of these terms may result in legal action.**

---

## Support

For support, email team@papareact.com

Built with ❤️ for the PAPAFAM
