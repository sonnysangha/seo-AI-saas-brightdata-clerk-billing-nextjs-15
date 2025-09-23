import OpenAI from 'openai';
import { buildGptPrompt } from '@/prompts/gpt';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function processSeoReport(perplexityData: any[]): Promise<any> {
  try {
    // Build the GPT prompt with the Perplexity data
    const prompt = buildGptPrompt(perplexityData);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 4000,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse the JSON response
    try {
      const seoReport = JSON.parse(content);
      return seoReport;
    } catch {
      console.error('Failed to parse GPT response as JSON:', content);
      throw new Error('Invalid JSON response from GPT');
    }

  } catch (error) {
    console.error('Error processing SEO report:', error);
    throw error;
  }
}