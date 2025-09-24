/**
 * Builds the Perplexity prompt that fetches comprehensive entity and backlink data
 * for a given target entity.
 */
export function buildPerplexityPrompt(target: string): string {
  return `
You are an SEO research assistant specializing in comprehensive entity analysis.

TASK: Conduct a thorough web search and analysis of the target entity, providing structured data for SEO research purposes.

TARGET: ${target}

INSTRUCTIONS:

1. **COMPREHENSIVE SEARCH**: Search for the target across multiple angles:
   - Primary name variations and aliases
   - Professional titles and roles
   - Company/brand associations
   - Geographic location mentions
   - Industry-specific keywords

2. **SOURCE CATEGORIZATION**: For each relevant result, categorize and extract:
   - **Official Sources**: Websites, social profiles, professional pages
   - **Social Media**: LinkedIn, Twitter/X, Instagram, YouTube, TikTok, Facebook
   - **Professional**: Company websites, portfolios, GitHub, professional directories
   - **Educational**: Course platforms, tutorial sites, educational content
   - **Community**: Forums, Reddit, discussion boards, community platforms
   - **News/Media**: Press coverage, interviews, articles, reviews
   - **Other**: Any additional relevant sources

3. **DETAILED EXTRACTION**: For each source, provide:
   - "title": Exact page/source title
   - "url": Complete URL
   - "description": Detailed summary (2-3 sentences) including key facts, metrics, or claims
   - "domain": Root domain for categorization
   - "source_type": Category from above list
   - "quality_indicators": Follower counts, engagement metrics, authority signals

4. **BACKLINK ANALYSIS**: Specifically research and identify:
   - **Direct Mentions**: Websites that mention or link to the entity
   - **Citation Sources**: News articles, blog posts, directory listings that reference them
   - **Professional References**: Company websites, partner sites, client testimonials
   - **Educational Citations**: Course platforms, tutorial sites, learning resources
   - **Community Mentions**: Forum discussions, Reddit posts, social media shares
   - **Press Coverage**: Media outlets, interviews, feature articles
   - **Directory Listings**: Professional directories, industry listings, awards
   - **Backlink Quality**: Assess domain authority, relevance, and link context
   - **Backlink Volume**: Estimate total number of backlinks and mentions
   - **Link Types**: Do-follow vs no-follow, contextual vs directory, editorial vs user-generated

5. **COMPREHENSIVE NARRATIVE**: Provide a detailed **answer_text** that includes:
   - Entity overview and primary activities
   - Professional background and achievements
   - Key metrics and statistics (follower counts, years of experience, etc.)
   - Notable projects, products, or services
   - Community impact and reach
   - Geographic presence and locations
   - Educational background and credentials
   - Current affiliations and partnerships
   - Unique value propositions and differentiators
   - **Backlink Profile Summary**: Total backlinks, high-authority domains, link diversity

6. **COMPETITIVE LANDSCAPE**: Search for Competitors of ${target}, include detailed analysis:
   - Identify competitors or similar entities mentioned in sources
   - Compare audience sizes, metrics, and market positioning when available
   - Include specific competitor names, follower counts, and platform presence
   - Assess relative market strength based on available data
   - Note any head-to-head comparisons found in sources
   - Industry peers and collaborators
   - Companies they've worked with
   - Market positioning context
   - **Competitive Backlink Analysis**: How their backlink profile compares to competitors

7. **EVIDENCE-BASED**: Include specific facts, numbers, and claims with source attribution. Be as comprehensive and factual as possible.

Focus on gathering the most complete picture possible with verifiable information, credible sources, and a thorough backlink profile analysis.
  `.trim();
}
