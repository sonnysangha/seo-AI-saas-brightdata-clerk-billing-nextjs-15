# SEO SaaS with BrightData Crawl API & AI Chatbot

This is a Next.js application that combines BrightData's Crawl API for SEO data collection with an AI-powered chatbot using OpenAI and the Vercel AI SDK.

## Features

- 🔍 **SEO Data Scraping**: Uses BrightData Crawl API to gather SEO insights from Perplexity AI
- 🤖 **AI Chatbot**: Interactive chatbot powered by OpenAI GPT-4o-mini for SEO analysis and recommendations
- 📊 **Real-time Data**: Convex database for storing and retrieving scraping jobs and results
- 🎨 **Modern UI**: Built with Next.js 15, Tailwind CSS, and Radix UI components
- 🔐 **Authentication**: Clerk integration for user management
- 📱 **Responsive Design**: Mobile-friendly chatbot interface with floating button

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- BrightData API account
- OpenAI API account
- Convex account (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brightdata-nextjs-15
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and fill in your API keys:
   
   ```bash
   cp .env.example .env.local
   ```
   
   Required environment variables:
   ```env
   # Convex Configuration
   NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
   NEXT_PUBLIC_CONVEX_SITE_URL=your_site_url_here
   
   # BrightData API
   BRIGHTDATA_API_KEY=your_brightdata_api_key_here
   
   # OpenAI API for Chatbot
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Clerk Authentication (optional)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   CLERK_SECRET_KEY=your_clerk_secret_key_here
   ```

4. **Set up Convex**
   ```bash
   npx convex dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### SEO Report Generation

1. Go to the dashboard (`/dashboard`)
2. Enter a business name, website, or product in the input field
3. Click "Generate Report" to start a BrightData scraping job
4. The system will use Perplexity AI to analyze SEO data
5. Results are stored in Convex and can be viewed in the report page

### AI Chatbot

The chatbot is available on both the dashboard and report pages:

1. **Floating Button**: Click the chat bubble icon in the bottom-right corner
2. **Predefined Prompts**: Use quick-start buttons for common SEO questions
3. **Custom Questions**: Ask specific questions about your SEO reports
4. **Context-Aware**: The chatbot has access to your recent SEO data for personalized advice

#### Example Questions

- "What are the key findings from my latest SEO reports?"
- "How can I improve my website's SEO performance?"
- "What SEO trends should I focus on?"
- "Analyze my competitor's SEO strategy"
- "What keywords should I target?"

## API Endpoints

- `POST /api/chat` - Chatbot API endpoint using Vercel AI SDK
- `POST /api/webhook` - BrightData webhook for receiving scraping results

## Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Convex Database
- **AI**: OpenAI GPT-4o-mini, Vercel AI SDK
- **Data Collection**: BrightData Crawl API
- **Authentication**: Clerk (optional)
- **UI Components**: Radix UI, Lucide React Icons

## Architecture

1. **Data Flow**: User input → BrightData API → Perplexity AI → Convex Database
2. **Chatbot**: User query → OpenAI API → Contextual response with SEO data
3. **Real-time Updates**: Webhook integration for job status updates

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/          # Chatbot API endpoint
│   │   └── webhook/       # BrightData webhook
│   ├── dashboard/         # Main dashboard
│   └── report/[id]/       # Individual report pages
├── components/
│   ├── Chatbot.tsx        # AI chatbot component
│   └── ui/                # Reusable UI components
├── convex/
│   ├── schema.ts          # Database schema
│   └── scrapingJobs.ts    # Database queries/mutations
├── actions/
│   └── startScraping.ts   # BrightData API integration
└── prompts/
    ├── gpt.ts             # GPT prompts
    └── perplexity.ts      # Perplexity AI prompts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the [BrightData documentation](https://docs.brightdata.com/scraping-automation/crawl-api/overview)
- Review [Vercel AI SDK docs](https://sdk.vercel.ai/)
- Open an issue in this repository