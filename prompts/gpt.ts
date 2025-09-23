/**
 * Builds the GPT prompt that converts a Perplexity JSON payload
 * into a comprehensive SEO report (only using web-search data).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildGptPrompt(perplexityJson: any): string {
  return `
  You are an expert SEO analyst.
  
  INPUT: You will be given a JSON array from Perplexity Search (below).  
  Use ONLY this payload to generate the SEO report.  
  Do not add extra keys. Do not output prose.  
  
  PERPLEXITY PAYLOAD:
  \`\`\`json
  ${JSON.stringify(perplexityJson, null, 2)}
  \`\`\`
  
  TASK: Use this payload to generate a **comprehensive SEO report** in a strict JSON schema (below).  
  
  RULES:
  1. Treat "prompt" as the entity. Infer resolved_entity.type as person|business|product|course|website|unknown.  
  2. Use "sources[]" as the basis for evidence. Every subsection must include at least one evidence item with a "url" from sources[] (and a short "quote" if possible).  
  3. Normalize:
     - Dates = ISO 8601 UTC  
     - Numbers = numbers  
     - Booleans = true/false  
     - All arrays must exist (may be empty)  
     - Deduplicate sources by canonical host  
  4. If information is unavailable, set the value to null or [].  
  5. Only include sections supported by **public web search results**:  
     - meta  
     - inventory  
     - serp_overview  
     - on_page  
     - content_analysis  
     - keywords  
     - competitors  
     - local_seo  
     - recommendations  
     (⚠️ Exclude sections requiring private tools or inaccessible telemetry such as "technical_seo" and "backlinks".)  
  6. Hard caps for stability:
     - competitors ≤ 10  
     - top_keywords ≤ 25  
     - keyword_clusters ≤ 8 clusters × ≤ 6 keywords each  
     - top_results per query ≤ 10  
     - serp_features ≤ 12  
     - recommendations ≤ 25  
  
  OUTPUT SCHEMA: Return only one JSON object with exactly these keys:
  
  {
    "meta": {...},
    "inventory": {...},
    "serp_overview": {...},
    "on_page": {...},
    "content_analysis": {...},
    "keywords": {...},
    "competitors": [...],
    "local_seo": {...},
    "recommendations": [...]
  }
  
  NOTES:
  - Do not fabricate beyond what’s in Perplexity sources.  
  - Cite evidence everywhere.  
  - Output strictly in JSON — no extra commentary.
  `.trim();
}
