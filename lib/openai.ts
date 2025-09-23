import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateChatResponse(
  messages: ChatMessage[],
  seoReport?: any
): Promise<string> {
  try {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `You are an expert SEO analyst chatbot. You help users understand and analyze SEO reports. 
      
${seoReport ? `Here is the SEO report data you should reference when answering questions:

${JSON.stringify(seoReport, null, 2)}

Use this data to provide specific, actionable insights. Always cite specific metrics and data points from the report when relevant.` : 'You are helping with general SEO questions.'}

Guidelines:
- Be helpful, accurate, and specific
- Provide actionable SEO recommendations
- Explain technical concepts in an accessible way
- Use data from the report to support your answers
- If asked about something not in the report, acknowledge the limitation
- Keep responses concise but comprehensive`,
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, ...messages],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate chat response');
  }
}

export function generateChatTitle(userMessage: string): string {
  // Generate a concise title from the user's first message
  const title = userMessage.length > 50 
    ? userMessage.substring(0, 47) + '...'
    : userMessage;
  
  return title;
}