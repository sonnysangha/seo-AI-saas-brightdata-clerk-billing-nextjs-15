// lib/seo-utils.ts
// Utility functions for SEO analysis

import {
  seoReportSchema,
  scrapingDataSchema,
  type SeoReport,
  type ScrapingData,
} from "@/lib/seo-schema";

/**
 * Validates SEO report data against the Zod schema
 */
export function validateSeoReport(data: unknown): SeoReport {
  return seoReportSchema.parse(data);
}

/**
 * Validates scraping data against the Zod schema
 */
export function validateScrapingData(data: unknown): ScrapingData {
  return scrapingDataSchema.parse(data);
}

/**
 * Safely validates SEO report data, returns null if invalid
 */
export function safeValidateSeoReport(data: unknown): SeoReport | null {
  try {
    return seoReportSchema.parse(data);
  } catch (error) {
    console.error("SEO report validation failed:", error);
    return null;
  }
}

/**
 * Safely validates scraping data, returns null if invalid
 */
export function safeValidateScrapingData(data: unknown): ScrapingData | null {
  try {
    return scrapingDataSchema.parse(data);
  } catch (error) {
    console.error("Scraping data validation failed:", error);
    return null;
  }
}

/**
 * Gets the schema structure for documentation purposes
 */
export function getSeoReportSchemaStructure() {
  return {
    sections: Object.keys(seoReportSchema.shape),
    totalSections: Object.keys(seoReportSchema.shape).length,
    schema: seoReportSchema,
  };
}

/**
 * Type guard to check if data is a valid SEO report
 */
export function isSeoReport(data: unknown): data is SeoReport {
  try {
    seoReportSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Type guard to check if data is valid scraping data
 */
export function isScrapingData(data: unknown): data is ScrapingData {
  try {
    scrapingDataSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}
