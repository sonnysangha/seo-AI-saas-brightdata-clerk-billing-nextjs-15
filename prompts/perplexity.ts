/**
 * Builds the Perplexity prompt that fetches structured SERP data
 * for a given target entity.
 */
export function buildPerplexityPrompt(target: string): string {
  return `
  You are an SEO research assistant.    
  
  TASK: Given the following target, return an overview of the entity and its presence in search results.
  The target may be a person, business, product, course, or website/URL.    
  
  TARGET: ${target}  
  
  INSTRUCTIONS:
  1. Search for the target on the web and identify:
     - Official website(s) and candidate websites
     - Official social profiles
     - News, reviews, or directory listings
     - Competitors or similar entities
  2. For each relevant result, extract:
     - "title"
     - "url"
     - "description" (short snippet/summary)
     - "position" (approximate SERP order if available)
  3. Provide a short **answer_text** narrative that describes the entity based on the search results.
  
  `.trim();
}
