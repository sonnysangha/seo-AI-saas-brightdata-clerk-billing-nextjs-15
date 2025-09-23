import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { generateChatResponse, generateChatTitle } from '@/lib/openai';
import { Id } from '@/convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, jobId } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let currentSessionId = sessionId;

    // If no session ID provided, create a new session
    if (!currentSessionId && jobId) {
      const title = generateChatTitle(message);
      currentSessionId = await convex.mutation(api.chatSessions.createChatSession, {
        jobId: jobId as Id<"scrapingJobs">,
        title,
      });
    }

    if (!currentSessionId) {
      return NextResponse.json({ error: 'Session ID or Job ID is required' }, { status: 400 });
    }

    // Add user message to the database
    await convex.mutation(api.chatMessages.addMessage, {
      sessionId: currentSessionId as Id<"chatSessions">,
      role: 'user',
      content: message,
    });

    // Get the job and SEO report data
    let seoReport = null;
    if (jobId) {
      const job = await convex.query(api.scrapingJobs.getJobById, {
        jobId: jobId as Id<"scrapingJobs">,
      });
      seoReport = job?.seoReport;
    }

    // Get conversation history
    const messages = await convex.query(api.chatMessages.getMessagesBySession, {
      sessionId: currentSessionId as Id<"chatSessions">,
    });

    // Convert to OpenAI format
    const chatMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // Generate AI response
    const aiResponse = await generateChatResponse(chatMessages, seoReport);

    // Add AI response to the database
    await convex.mutation(api.chatMessages.addMessage, {
      sessionId: currentSessionId as Id<"chatSessions">,
      role: 'assistant',
      content: aiResponse,
    });

    return NextResponse.json({
      response: aiResponse,
      sessionId: currentSessionId,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}