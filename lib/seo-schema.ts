// lib/seo-schema.ts
// Zod schema for SEO report validation - generated from TypeScript interfaces

import { z } from "zod";

// Base schemas
const evidenceSchema = z.object({
  url: z.string(),
  quote: z.string().optional(),
  relevance_score: z.number().optional(),
});

const sourceSchema = z.object({
  title: z.string(),
  url: z.string(),
  description: z.string(),
});

// Main SEO report schema
export const seoReportSchema = z.object({
  meta: z.object({
    entity_name: z.string(),
    entity_type: z.enum([
      "person",
      "business",
      "product",
      "course",
      "website",
      "unknown",
    ]),
    analysis_date: z.string(),
    data_sources_count: z.number(),
    confidence_score: z.number().min(0).max(1),
  }),

  inventory: z.object({
    total_sources: z.number(),
    unique_domains: z.array(z.string()),
    source_types: z.object({
      social_media: z.array(
        z.object({
          domain: z.string(),
          url: z.string(),
          title: z.string(),
          description: z.string(),
          quality_score: z.number().min(0).max(1).optional(),
        })
      ),
      professional: z.array(
        z.object({
          domain: z.string(),
          url: z.string(),
          title: z.string(),
          description: z.string(),
          quality_score: z.number().min(0).max(1).optional(),
        })
      ),
      educational: z.array(
        z.object({
          domain: z.string(),
          url: z.string(),
          title: z.string(),
          description: z.string(),
          quality_score: z.number().min(0).max(1).optional(),
        })
      ),
      community: z.array(
        z.object({
          domain: z.string(),
          url: z.string(),
          title: z.string(),
          description: z.string(),
          quality_score: z.number().min(0).max(1).optional(),
        })
      ),
      news: z.array(
        z.object({
          domain: z.string(),
          url: z.string(),
          title: z.string(),
          description: z.string(),
          quality_score: z.number().min(0).max(1).optional(),
        })
      ),
      other: z.array(
        z.object({
          domain: z.string(),
          url: z.string(),
          title: z.string(),
          description: z.string(),
          quality_score: z.number().min(0).max(1).optional(),
        })
      ),
    }),
    source_quality_score: z.number().min(0).max(1).optional(),
    authority_domains: z.array(z.string()).optional(),
    content_depth_indicators: z.array(z.string()).optional(),
    date_range: z.object({
      earliest: z.string().nullable(),
      latest: z.string().nullable(),
    }),
  }),

  serp_overview: z.object({
    primary_keywords: z.array(z.string()).max(25),
    search_volume_estimate: z.enum(["high", "medium", "low", "unknown"]),
    competition_level: z.enum(["high", "medium", "low", "unknown"]),
    top_results: z
      .array(
        z.object({
          title: z.string(),
          url: z.string(),
          snippet: z.string(),
          position: z.number(),
        })
      )
      .max(10),
    serp_features: z
      .array(
        z.object({
          type: z.enum([
            "featured_snippet",
            "knowledge_panel",
            "images",
            "videos",
            "news",
            "local_pack",
            "related_searches",
            "people_also_ask",
          ]),
          present: z.boolean(),
          details: z.string().optional(),
        })
      )
      .max(12),
  }),

  on_page: z.object({
    title_tag: z.string().nullable(),
    meta_description: z.string().nullable(),
    headings: z.object({
      h1: z.array(z.string()),
      h2: z.array(z.string()),
      h3: z.array(z.string()),
    }),
    content_length: z.number().nullable(),
    readability_score: z.enum(["excellent", "good", "fair", "poor", "unknown"]),
    internal_links: z.number().nullable(),
    external_links: z.number().nullable(),
    images_with_alt: z.number().nullable(),
    total_images: z.number().nullable(),
  }),

  content_analysis: z.object({
    content_themes: z.array(
      z.object({
        theme: z.string(),
        frequency: z.number(),
        evidence: z.array(evidenceSchema),
      })
    ),
    sentiment: z.union([
      z.enum(["positive", "neutral", "negative", "mixed"]),
      z.object({
        overall: z.string(),
        breakdown: z.object({
          positive: z.number().min(0).max(1),
          neutral: z.number().min(0).max(1),
          negative: z.number().min(0).max(1),
        }),
        evidence: z.array(evidenceSchema),
      }),
    ]),
    expertise_indicators: z.array(z.string()),
    content_gaps: z.array(z.string()),
    unique_value_propositions: z.array(z.string()),
    content_depth_indicators: z.array(z.string()).optional(),
    specific_mentions: z.array(z.string()).optional(),
  }),

  keywords: z.object({
    top_keywords: z
      .array(
        z.object({
          keyword: z.string(),
          search_volume: z.enum(["high", "medium", "low", "unknown"]),
          difficulty: z.enum(["high", "medium", "low", "unknown"]),
          intent: z.enum([
            "informational",
            "navigational",
            "transactional",
            "commercial",
            "unknown",
          ]),
          evidence: z.array(evidenceSchema),
        })
      )
      .max(25),
    keyword_clusters: z
      .array(
        z.object({
          cluster_name: z.string(),
          keywords: z
            .array(
              z.object({
                keyword: z.string(),
                search_volume: z.enum(["high", "medium", "low", "unknown"]),
                difficulty: z.enum(["high", "medium", "low", "unknown"]),
                intent: z.enum([
                  "informational",
                  "navigational",
                  "transactional",
                  "commercial",
                  "unknown",
                ]),
                evidence: z.array(evidenceSchema),
              })
            )
            .max(6),
          theme: z.string(),
        })
      )
      .max(8),
    long_tail_opportunities: z.array(z.string()),
    brand_terms: z.array(z.string()).optional(),
    product_names: z.array(z.string()).optional(),
    service_offerings: z.array(z.string()).optional(),
  }),

  competitors: z
    .array(
      z.object({
        name: z.string(),
        domain: z.string(),
        strength_score: z.number().min(0).max(10),
        overlap_keywords: z.array(z.string()),
        unique_advantages: z.array(z.string()),
        relationship: z
          .enum(["competitor", "employer", "partner", "unknown"])
          .optional(),
        evidence: z.array(evidenceSchema),
      })
    )
    .min(3)
    .max(15),

  local_seo: z.object({
    location_mentions: z.array(z.string()),
    local_keywords: z.array(z.string()),
    local_competitors: z.array(z.string()),
    local_citations: z.array(
      z.object({
        platform: z.string(),
        url: z.string(),
        status: z.enum(["verified", "unverified", "unknown"]),
      })
    ),
  }),

  recommendations: z
    .array(
      z.object({
        category: z.enum([
          "content",
          "technical",
          "link_building",
          "local_seo",
          "competitor_analysis",
          "keyword_optimization",
        ]),
        priority: z.enum(["high", "medium", "low"]),
        title: z.string(),
        description: z.string(),
        expected_impact: z.enum(["high", "medium", "low"]),
        effort_required: z.enum(["high", "medium", "low"]),
        evidence: z.array(evidenceSchema),
        implementation_steps: z.array(z.string()),
        data_driven_insights: z.array(z.string()).optional(),
        specific_quotes: z.array(z.string()).optional(),
      })
    )
    .min(3)
    .max(25),

  summary: z.object({
    overall_score: z.number().min(0).max(100),
    key_strengths: z.array(z.string()),
    critical_issues: z.array(z.string()),
    quick_wins: z.array(z.string()),
    long_term_opportunities: z.array(z.string()),
  }),
});

// Scraping data schema
export const scrapingDataSchema = z.object({
  url: z.string(),
  prompt: z.string(),
  answer_text: z.string(),
  sources: z.array(sourceSchema),
  timestamp: z.string(),
});

// Type inference from schema - single source of truth
export type SeoReport = z.infer<typeof seoReportSchema>;
export type ScrapingData = z.infer<typeof scrapingDataSchema>;

// Individual interface exports for convenience
export type Meta = SeoReport["meta"];
export type Inventory = SeoReport["inventory"];
export type SerpOverview = SeoReport["serp_overview"];
export type OnPage = SeoReport["on_page"];
export type ContentAnalysis = SeoReport["content_analysis"];
export type Keyword = SeoReport["keywords"]["top_keywords"][0];
export type Competitor = SeoReport["competitors"][0];
export type LocalSeo = SeoReport["local_seo"];
export type Recommendation = SeoReport["recommendations"][0];
export type Evidence =
  SeoReport["content_analysis"]["content_themes"][0]["evidence"][0];
export type Source = ScrapingData["sources"][0];
