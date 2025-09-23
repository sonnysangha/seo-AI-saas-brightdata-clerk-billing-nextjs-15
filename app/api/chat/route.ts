import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Initialize Convex client to fetch SEO data
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    
    // Get recent completed scraping jobs to provide context
    const recentJobs = await convex.query(api.scrapingJobs.getRecentCompletedJobs, {
      limit: 5
    });

    // Build context from SEO data
    let contextData = '';
    if (recentJobs && recentJobs.length > 0) {
      contextData = recentJobs.map(job => {
        const results = job.results || [];
        const summaryData = results.map(result => {
          return `SEO Report for "${job.originalPrompt}":
- URL: ${result.url || 'N/A'}
- Answer: ${result.answer_text || 'N/A'}
- Sources: ${result.sources?.join(', ') || 'N/A'}
- Timestamp: ${result.timestamp || 'N/A'}`;
        }).join('\n');
        return summaryData;
      }).join('\n\n');
    }

    const systemMessage = `You are an SEO assistant chatbot that helps users understand and analyze their SEO reports. You have access to recent SEO data and can provide insights, recommendations, and answer questions about SEO performance.

${contextData ? `Here is the recent SEO data you can reference:

${contextData}

` : 'Currently, no recent SEO data is available. '}

Please provide helpful, accurate, and actionable SEO advice based on the available data. If specific data isn't available, provide general SEO best practices and recommendations.

Keep your responses concise but informative, and always try to relate your advice back to the user's specific SEO goals and the data available.`;

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: systemMessage,
      messages: convertToCoreMessages(messages),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}