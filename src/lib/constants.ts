// Centralized constants for categories, devices, and metrics
// Now using 4-tier measurement system with 15 categories

import { TierLevel } from "./assessments";

// 15 Categories organized by tier
export const CATEGORIES = [
  // Tier 1: Wearables PRIMARY
  { value: "sleep", label: "Sleep", tier: 1 as TierLevel },
  { value: "recovery", label: "Recovery", tier: 1 as TierLevel },
  { value: "fitness", label: "Fitness & Activity", tier: 1 as TierLevel },

  // Tier 2: Co-Primary
  { value: "stress", label: "Stress", tier: 2 as TierLevel },

  // Tier 3: Assessment PRIMARY
  { value: "energy", label: "Energy & Vitality", tier: 3 as TierLevel },
  { value: "focus", label: "Focus & Cognition", tier: 3 as TierLevel },
  { value: "mood", label: "Mood", tier: 3 as TierLevel },
  { value: "anxiety", label: "Anxiety", tier: 3 as TierLevel },
  { value: "pain", label: "Pain & Comfort", tier: 3 as TierLevel },

  // Tier 4: Assessment Only
  { value: "skin", label: "Skin & Beauty", tier: 4 as TierLevel },
  { value: "gut", label: "Gut & Digestion", tier: 4 as TierLevel },
  { value: "immunity", label: "Immunity", tier: 4 as TierLevel },
  { value: "hair", label: "Hair", tier: 4 as TierLevel },
  { value: "weight", label: "Weight & Metabolism", tier: 4 as TierLevel },
  { value: "libido", label: "Sexual Wellness", tier: 4 as TierLevel },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

// Simple category names for display (backwards compatible)
export const CATEGORY_LABELS: Record<string, string> = {
  // Current categories
  sleep: "Sleep",
  recovery: "Recovery",
  fitness: "Fitness & Activity",
  stress: "Stress",
  energy: "Energy & Vitality",
  focus: "Focus & Cognition",
  mood: "Mood",
  anxiety: "Anxiety",
  pain: "Pain & Comfort",
  skin: "Skin & Beauty",
  gut: "Gut & Digestion",
  immunity: "Immunity",
  hair: "Hair",
  weight: "Weight & Metabolism",
  libido: "Sexual Wellness",
  // Legacy mappings for old category values
  Sleep: "Sleep",
  Stress: "Stress",
  Energy: "Energy & Vitality",
  Recovery: "Recovery",
  Fitness: "Fitness & Activity",
  Nutrition: "Gut & Digestion",
  Skin: "Skin & Beauty",
  nutrition: "Gut & Digestion",
  longevity: "Energy & Vitality",
  cognitive: "Focus & Cognition",
};

export const DEVICES = [
  { value: "any", label: "Any Device" },
  { value: "oura", label: "Oura Ring" },
  { value: "whoop", label: "Whoop" },
  { value: "apple", label: "Apple Watch" },
  { value: "garmin", label: "Garmin" },
  { value: "fitbit", label: "Fitbit" },
] as const;

export type DeviceValue = (typeof DEVICES)[number]["value"];

export const DEVICE_LABELS: Record<string, string> = {
  oura: "Oura Ring",
  whoop: "Whoop",
  apple: "Apple Watch",
  garmin: "Garmin",
  fitbit: "Fitbit",
  any: "Any Device",
};

export const METRICS = [
  { id: "sleep-quality", label: "Sleep Quality", icon: "💤" },
  { id: "deep-sleep", label: "Deep Sleep", icon: "🌙" },
  { id: "rem-sleep", label: "REM Sleep", icon: "😴" },
  { id: "hrv", label: "HRV (Heart Rate Variability)", icon: "💓" },
  { id: "resting-heart-rate", label: "Resting Heart Rate", icon: "❤️" },
  { id: "stress", label: "Stress", icon: "😰" },
  { id: "recovery-score", label: "Recovery Score", icon: "🔋" },
  { id: "steps", label: "Steps", icon: "👣" },
  { id: "energy", label: "Energy", icon: "⚡" },
] as const;

export type MetricId = (typeof METRICS)[number]["id"];

// Default days for villain variable questions
export const DEFAULT_VILLAIN_DAYS = [7, 14, 21, 28] as const;

// Study status definitions
export const STUDY_STATUSES = {
  draft: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Draft" },
  recruiting: { bg: "bg-[#00D1C1]/20", text: "text-[#00D1C1]", label: "Recruiting" },
  "filling-fast": { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Filling Fast" },
  full: { bg: "bg-orange-500/20", text: "text-orange-400", label: "Full" },
  completed: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Completed" },
  active: { bg: "bg-green-500/20", text: "text-green-400", label: "Active" },
  archived: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Archived" },
} as const;

export type StudyStatus = keyof typeof STUDY_STATUSES;
