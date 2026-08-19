import { CategoryType, CategoryInfo } from "../types";

export const CATEGORIES: Record<CategoryType, CategoryInfo> = {
  food: {
    id: "food",
    name: "Food & Dining",
    iconName: "Utensils",
    color: "#f97316", // Orange
    bgLight: "rgba(249, 115, 22, 0.15)",
  },
  subscriptions: {
    id: "subscriptions",
    name: "Subscriptions",
    iconName: "Tv",
    color: "#a855f7", // Purple
    bgLight: "rgba(168, 85, 247, 0.15)",
  },
  shopping: {
    id: "shopping",
    name: "Shopping",
    iconName: "ShoppingBag",
    color: "#ec4899", // Pink
    bgLight: "rgba(236, 72, 153, 0.15)",
  },
  transport: {
    id: "transport",
    name: "Transport & Fuel",
    iconName: "Car",
    color: "#3b82f6", // Blue
    bgLight: "rgba(59, 130, 246, 0.15)",
  },
  utilities: {
    id: "utilities",
    name: "Utilities & Bills",
    iconName: "Zap",
    color: "#eab308", // Yellow
    bgLight: "rgba(234, 179, 8, 0.15)",
  },
  entertainment: {
    id: "entertainment",
    name: "Entertainment",
    iconName: "Film",
    color: "#06b6d4", // Cyan
    bgLight: "rgba(6, 182, 212, 0.15)",
  },
  health: {
    id: "health",
    name: "Health & Fitness",
    iconName: "HeartPulse",
    color: "#10b981", // Emerald
    bgLight: "rgba(16, 185, 129, 0.15)",
  },
  housing: {
    id: "housing",
    name: "Housing & Rent",
    iconName: "Home",
    color: "#6366f1", // Indigo
    bgLight: "rgba(99, 102, 241, 0.15)",
  },
  misc: {
    id: "misc",
    name: "Miscellaneous",
    iconName: "Sparkles",
    color: "#94a3b8", // Slate
    bgLight: "rgba(148, 163, 184, 0.15)",
  },
};

/**
 * Smart Auto-Categorization based on keyword match in transaction title
 */
export function autoDetectCategory(description: string): CategoryType {
  const text = description.toLowerCase().trim();

  if (!text) return "misc";

  // Food & Dining
  if (
    /\b(coffee|starbucks|cafe|restaurant|swiggy|zomato|burger|pizza|lunch|dinner|breakfast|snack|mcdonalds|kfc|dominos|food|groceries|supermarket|tea|chai|bakery)\b/i.test(
      text,
    )
  ) {
    return "food";
  }

  // Subscriptions & Digital Services
  if (
    /\b(netflix|spotify|youtube|prime|hbo|icloud|chatgpt|openai|disney|apple|google one|playstation plus|xbox|sub|subscription|patreon|medium|nytimes|dropbox)\b/i.test(
      text,
    )
  ) {
    return "subscriptions";
  }

  // Transport
  if (
    /\b(uber|ola|rapido|metro|cab|taxi|petrol|diesel|fuel|gas|flight|airline|train|railway|parking|toll|bus)\b/i.test(
      text,
    )
  ) {
    return "transport";
  }

  // Shopping
  if (
    /\b(amazon|flipkart|myntra|zara|h&m|nike|adidas|uniqlo|clothes|shoes|electronics|shopping|mall|sephora|mecca|store)\b/i.test(
      text,
    )
  ) {
    return "shopping";
  }

  // Utilities
  if (
    /\b(electricity|water|wifi|broadband|internet|recharge|mobile|phone bill|utility|gas bill|power)\b/i.test(
      text,
    )
  ) {
    return "utilities";
  }

  // Entertainment
  if (
    /\b(movie|cinema|pvr|inox|concert|event|bowling|club|pub|bar|drinks|steam|game|nintendo)\b/i.test(
      text,
    )
  ) {
    return "entertainment";
  }

  // Health
  if (
    /\b(gym|cult|fitness|doctor|pharmacy|medicine|hospital|dentist|health|supplement|protein|spa|massage)\b/i.test(
      text,
    )
  ) {
    return "health";
  }

  // Housing
  if (/\b(rent|mortgage|apartment|flat|maintenance|society|lease)\b/i.test(text)) {
    return "housing";
  }

  return "misc";
}
