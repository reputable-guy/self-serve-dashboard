// Reputable Assessments - 4-Tier Measurement System
// The key insight: don't ask someone about their sleep when you have their Oura data.

export type TierLevel = 1 | 2 | 3 | 4;

// Response Types for different question scales
export type ResponseType = 'scale_5' | 'scale_10' | 'scale_11' | 'frequency_5' | 'frequency_4' | 'open_text' | 'photo' | 'numeric';

// Response Option (for display)
export interface ResponseOption {
  value: number;
  label: string;
}

// Assessment Question Definition
export interface AssessmentQuestion {
  id: string;
  text: string;
  responseType: ResponseType;
  responseOptions?: ResponseOption[];
  reverseScored?: boolean;
  isPrimary?: boolean; // Is this the "headline" question for this category?
  dayOnly?: number[]; // Only show on specific days (e.g., [1] for Day 1 only)
}

// Reputable Assessment Definition
export interface ReputableAssessment {
  id: string;
  name: string;
  shortName: string;
  description: string;
  inspiredBy: string;
  questions: AssessmentQuestion[];
  checkInDays: number[];
  requiresPhotos?: boolean;
}

// Question Response (from participant)
export interface QuestionResponse {
  questionId: string;
  questionText: string;
  responseType: ResponseType;
  rawValue: number | string;
  isReverseScored: boolean;
  normalizedValue: number; // 0-100
}

// Assessment Response (full submission)
export interface AssessmentResponse {
  odorId?: string;
  participantId: string;
  studyId: string;
  category: string;
  day: number;
  timestamp: Date;
  responses: QuestionResponse[];
  compositeScore: number;
  primaryScore: number;
}

// Assessment Result (computed from baseline + endpoint)
export interface AssessmentResult {
  assessmentId: string;
  assessmentName: string;
  categoryLabel: string;
  baseline: {
    date: Date;
    compositeScore: number;
    primaryScore: number;
    primaryRaw: number;  // Raw value (e.g., 4 on a 1-10 scale)
    primaryMax: number;  // Max value for the scale (e.g., 10)
    responses: QuestionResponse[];
  };
  endpoint: {
    date: Date;
    compositeScore: number;
    primaryScore: number;
    primaryRaw: number;
    primaryMax: number;
    responses: QuestionResponse[];
  };
  change: {
    compositePoints: number;
    compositePercent: number;
    primaryPoints: number;
    primaryPercent: number;
  };
  improved: boolean;
  headline: string;  // Marketing-ready headline, e.g., "Energy improved from 4/10 to 8/10 (+100%)"
}

// Category Configuration
export interface CategoryConfig {
  value: string;
  label: string;
  tier: TierLevel;
  assessmentId: string;
  requiresPhotos: boolean;
  wearableMetrics: string[];
  checkInDays: number[];
  description: string;
  primaryQuestionId: string;
}

// Score interpretation for 0-100 scale
export interface ScoreInterpretation {
  minScore: number;
  maxScore: number;
  label: string;
  color: string;
}

export const SCORE_INTERPRETATIONS: ScoreInterpretation[] = [
  { minScore: 0, maxScore: 24, label: "Poor", color: "red" },
  { minScore: 25, maxScore: 49, label: "Fair", color: "yellow" },
  { minScore: 50, maxScore: 74, label: "Good", color: "green" },
  { minScore: 75, maxScore: 100, label: "Excellent", color: "emerald" },
];

// ============================================
// RESPONSE OPTIONS PRESETS
// ============================================

const QUALITY_5: ResponseOption[] = [
  { value: 1, label: "Very poor" },
  { value: 2, label: "Poor" },
  { value: 3, label: "Fair" },
  { value: 4, label: "Good" },
  { value: 5, label: "Very good" },
];

const QUALITY_5_EXCELLENT: ResponseOption[] = [
  { value: 1, label: "Very poor" },
  { value: 2, label: "Poor" },
  { value: 3, label: "Fair" },
  { value: 4, label: "Good" },
  { value: 5, label: "Excellent" },
];

const RESTED_5: ResponseOption[] = [
  { value: 1, label: "Not at all rested" },
  { value: 2, label: "Slightly rested" },
  { value: 3, label: "Moderately rested" },
  { value: 4, label: "Well rested" },
  { value: 5, label: "Completely rested" },
];

const RECOVERED_5: ResponseOption[] = [
  { value: 1, label: "Not at all recovered" },
  { value: 2, label: "Slightly recovered" },
  { value: 3, label: "Moderately recovered" },
  { value: 4, label: "Well recovered" },
  { value: 5, label: "Fully recovered" },
];

const READY_5: ResponseOption[] = [
  { value: 1, label: "Not at all ready" },
  { value: 2, label: "Slightly ready" },
  { value: 3, label: "Moderately ready" },
  { value: 4, label: "Very ready" },
  { value: 5, label: "Completely ready" },
];

const MOTIVATED_5: ResponseOption[] = [
  { value: 1, label: "Not at all motivated" },
  { value: 2, label: "Slightly motivated" },
  { value: 3, label: "Moderately motivated" },
  { value: 4, label: "Very motivated" },
  { value: 5, label: "Extremely motivated" },
];

const FREQUENCY_5_NEVER_TO_OFTEN: ResponseOption[] = [
  { value: 0, label: "Never" },
  { value: 1, label: "Almost never" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Fairly often" },
  { value: 4, label: "Very often" },
];

const FREQUENCY_5_RARELY: ResponseOption[] = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Often" },
  { value: 4, label: "Always" },
];

const FREQUENCY_5_DAYS: ResponseOption[] = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely (1-2 days)" },
  { value: 2, label: "Sometimes (3-4 days)" },
  { value: 3, label: "Often (5-6 days)" },
  { value: 4, label: "Every day" },
];

const FREQUENCY_4_GAD: ResponseOption[] = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

const AFFECT_5: ResponseOption[] = [
  { value: 1, label: "Not at all" },
  { value: 2, label: "A little" },
  { value: 3, label: "Moderately" },
  { value: 4, label: "Quite a bit" },
  { value: 5, label: "Extremely" },
];

const SLEEP_LATENCY_4: ResponseOption[] = [
  { value: 4, label: "Less than 15 minutes" },
  { value: 3, label: "15-30 minutes" },
  { value: 2, label: "31-60 minutes" },
  { value: 1, label: "More than 60 minutes" },
];

const WAKE_UPS_4: ResponseOption[] = [
  { value: 4, label: "Never" },
  { value: 3, label: "Once per night" },
  { value: 2, label: "2-3 times per night" },
  { value: 1, label: "4 or more times per night" },
];

const SORENESS_5: ResponseOption[] = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely (1-2 days)" },
  { value: 2, label: "Sometimes (3-4 days)" },
  { value: 3, label: "Often (5-6 days)" },
  { value: 4, label: "Every day" },
];

const ACTIVITY_DAYS_5: ResponseOption[] = [
  { value: 1, label: "0 days" },
  { value: 2, label: "1-2 days" },
  { value: 3, label: "3-4 days" },
  { value: 4, label: "5-6 days" },
  { value: 5, label: "Every day" },
];

const ENERGY_CONSISTENCY_5: ResponseOption[] = [
  { value: 1, label: "Very inconsistent (major highs and lows)" },
  { value: 2, label: "Somewhat inconsistent" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Fairly consistent" },
  { value: 5, label: "Very consistent (steady energy all day)" },
];

const BALANCE_5: ResponseOption[] = [
  { value: 1, label: "Very unbalanced" },
  { value: 2, label: "Somewhat unbalanced" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Somewhat balanced" },
  { value: 5, label: "Very balanced" },
];

const BOTHERED_5: ResponseOption[] = [
  { value: 5, label: "Not at all bothered" },
  { value: 4, label: "Slightly bothered" },
  { value: 3, label: "Moderately bothered" },
  { value: 2, label: "Very bothered" },
  { value: 1, label: "Extremely bothered" },
];

const CONFIDENT_5: ResponseOption[] = [
  { value: 1, label: "Not at all confident" },
  { value: 2, label: "Slightly confident" },
  { value: 3, label: "Moderately confident" },
  { value: 4, label: "Very confident" },
  { value: 5, label: "Extremely confident" },
];

const HYDRATION_5: ResponseOption[] = [
  { value: 1, label: "Very dry" },
  { value: 2, label: "Somewhat dry" },
  { value: 3, label: "Normal" },
  { value: 4, label: "Somewhat hydrated" },
  { value: 5, label: "Very hydrated" },
];

const REGULARITY_5: ResponseOption[] = [
  { value: 1, label: "Very irregular" },
  { value: 2, label: "Somewhat irregular" },
  { value: 3, label: "Normal" },
  { value: 4, label: "Somewhat regular" },
  { value: 5, label: "Very regular" },
];

const SICK_DAYS_5: ResponseOption[] = [
  { value: 5, label: "0 days" },
  { value: 4, label: "1-2 days" },
  { value: 3, label: "3-5 days" },
  { value: 2, label: "6-10 days" },
  { value: 1, label: "More than 10 days" },
];

const RESILIENCE_5: ResponseOption[] = [
  { value: 1, label: "Very weak" },
  { value: 2, label: "Somewhat weak" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Somewhat strong" },
  { value: 5, label: "Very strong" },
];

const CATCH_ILLNESS_5: ResponseOption[] = [
  { value: 1, label: "Much more often" },
  { value: 2, label: "Somewhat more often" },
  { value: 3, label: "About the same" },
  { value: 4, label: "Somewhat less often" },
  { value: 5, label: "Much less often" },
];

const SHEDDING_5: ResponseOption[] = [
  { value: 5, label: "No shedding" },
  { value: 4, label: "Minimal shedding (normal)" },
  { value: 3, label: "Moderate shedding" },
  { value: 2, label: "Heavy shedding" },
  { value: 1, label: "Severe shedding" },
];

const THICKNESS_5: ResponseOption[] = [
  { value: 1, label: "Very thin" },
  { value: 2, label: "Somewhat thin" },
  { value: 3, label: "Normal" },
  { value: 4, label: "Somewhat thick" },
  { value: 5, label: "Very thick" },
];

const SHINE_5: ResponseOption[] = [
  { value: 1, label: "Very dull" },
  { value: 2, label: "Somewhat dull" },
  { value: 3, label: "Normal" },
  { value: 4, label: "Somewhat shiny" },
  { value: 5, label: "Very shiny" },
];

const STRENGTH_5: ResponseOption[] = [
  { value: 1, label: "Very weak" },
  { value: 2, label: "Somewhat weak" },
  { value: 3, label: "Normal" },
  { value: 4, label: "Somewhat strong" },
  { value: 5, label: "Very strong" },
];

const APPETITE_CONTROL_5: ResponseOption[] = [
  { value: 1, label: "Very poor (constant cravings)" },
  { value: 2, label: "Poor" },
  { value: 3, label: "Fair" },
  { value: 4, label: "Good" },
  { value: 5, label: "Excellent (complete control)" },
];

const METABOLISM_ENERGY_5: ResponseOption[] = [
  { value: 1, label: "Very sluggish" },
  { value: 2, label: "Somewhat sluggish" },
  { value: 3, label: "Normal" },
  { value: 4, label: "Somewhat energetic" },
  { value: 5, label: "Very energetic" },
];

const SATISFACTION_5: ResponseOption[] = [
  { value: 1, label: "Very unsatisfied" },
  { value: 2, label: "Somewhat unsatisfied" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Somewhat satisfied" },
  { value: 5, label: "Very satisfied" },
];

const BLOATED_AFTER_MEAL_5: ResponseOption[] = [
  { value: 5, label: "Never" },
  { value: 4, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 2, label: "Often" },
  { value: 1, label: "After every meal" },
];

// Generate 0-10 scale options for pain
const PAIN_SCALE_11: ResponseOption[] = Array.from({ length: 11 }, (_, i) => ({
  value: i,
  label: i === 0 ? "0 - No pain" : i === 10 ? "10 - Pain as bad as you can imagine" : String(i),
}));

// Generate 0-10 scale for interference
const INTERFERENCE_SCALE_11: ResponseOption[] = Array.from({ length: 11 }, (_, i) => ({
  value: i,
  label: i === 0 ? "0 - Does not interfere" : i === 10 ? "10 - Completely interferes" : String(i),
}));

// Generate 1-10 scale for general ratings
const SCALE_10: ResponseOption[] = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: String(i + 1),
}));

// ============================================
// 14 REPUTABLE ASSESSMENTS
// ============================================

export const REPUTABLE_ASSESSMENTS: ReputableAssessment[] = [
  // ==========================================
  // TIER 1: Wearable Primary (Brief Assessments)
  // ==========================================

  // Sleep Assessment
  {
    id: "reputable-sleep",
    name: "Reputable Sleep Assessment",
    shortName: "RSA",
    description: "Measures sleep quality, duration, and daytime impact",
    inspiredBy: "Inspired by PSQI, ISI",
    checkInDays: [1, 30],
    questions: [
      {
        id: "sleep-1",
        text: "Over the past week, how would you rate your overall sleep quality?",
        responseType: "scale_5",
        responseOptions: QUALITY_5,
        isPrimary: true,
      },
      {
        id: "sleep-2",
        text: "Over the past week, how long did it typically take you to fall asleep?",
        responseType: "scale_5",
        responseOptions: SLEEP_LATENCY_4,
      },
      {
        id: "sleep-3",
        text: "Over the past week, how often did you wake up during the night?",
        responseType: "scale_5",
        responseOptions: WAKE_UPS_4,
      },
      {
        id: "sleep-4",
        text: "Over the past week, how rested did you feel when you woke up in the morning?",
        responseType: "scale_5",
        responseOptions: RESTED_5,
      },
      {
        id: "sleep-5",
        text: "Over the past week, how much did poor sleep affect your daytime energy and functioning?",
        responseType: "scale_5",
        responseOptions: AFFECT_5,
        reverseScored: true,
      },
      {
        id: "sleep-6",
        text: "What's your biggest challenge with sleep right now?",
        responseType: "open_text",
        dayOnly: [1],
      },
      {
        id: "sleep-7",
        text: "How has your sleep changed over the past 30 days?",
        responseType: "open_text",
        dayOnly: [30],
      },
      {
        id: "sleep-8",
        text: "What surprised you most about this experience?",
        responseType: "open_text",
        dayOnly: [30],
      },
    ],
  },

  // Recovery Assessment
  {
    id: "reputable-recovery",
    name: "Reputable Recovery Assessment",
    shortName: "RRA",
    description: "Measures physical recovery and readiness",
    inspiredBy: "Inspired by REST-Q, Perceived Recovery Status Scale",
    checkInDays: [1, 30],
    questions: [
      {
        id: "recovery-1",
        text: "Over the past week, how recovered did you feel when you woke up each morning?",
        responseType: "scale_5",
        responseOptions: RECOVERED_5,
        isPrimary: true,
      },
      {
        id: "recovery-2",
        text: "Over the past week, how would you rate your body's ability to bounce back after physical activity?",
        responseType: "scale_5",
        responseOptions: QUALITY_5_EXCELLENT,
      },
      {
        id: "recovery-3",
        text: "Over the past week, how often did you experience muscle soreness or physical fatigue that lingered?",
        responseType: "frequency_5",
        responseOptions: SORENESS_5,
        reverseScored: true,
      },
      {
        id: "recovery-4",
        text: "Over the past week, how ready did you feel to take on physical or mental challenges each day?",
        responseType: "scale_5",
        responseOptions: READY_5,
      },
      {
        id: "recovery-5",
        text: "What does recovery mean to you, and what's your biggest challenge with it?",
        responseType: "open_text",
        dayOnly: [1],
      },
      {
        id: "recovery-6",
        text: "How has your recovery changed over the past 30 days?",
        responseType: "open_text",
        dayOnly: [30],
      },
    ],
  },

  // Fitness / Activity Assessment
  {
    id: "reputable-fitness",
    name: "Reputable Fitness Assessment",
    shortName: "RFA",
    description: "Measures fitness levels and physical activity",
    inspiredBy: "Inspired by IPAQ, Godin Leisure-Time Exercise Questionnaire",
    checkInDays: [1, 30],
    questions: [
      {
        id: "fitness-1",
        text: "Over the past week, how many days did you engage in moderate to vigorous physical activity for at least 30 minutes?",
        responseType: "scale_5",
        responseOptions: ACTIVITY_DAYS_5,
      },
      {
        id: "fitness-2",
        text: "How would you rate your current overall fitness level?",
        responseType: "scale_5",
        responseOptions: QUALITY_5_EXCELLENT,
        isPrimary: true,
      },
      {
        id: "fitness-3",
        text: "Over the past week, how motivated did you feel to exercise or be physically active?",
        responseType: "scale_5",
        responseOptions: MOTIVATED_5,
      },
      {
        id: "fitness-4",
        text: "Over the past week, how would you rate your physical endurance during activities?",
        responseType: "scale_5",
        responseOptions: QUALITY_5_EXCELLENT,
      },
      {
        id: "fitness-5",
        text: "What are your current fitness goals, and what's holding you back?",
        responseType: "open_text",
        dayOnly: [1],
      },
      {
        id: "fitness-6",
        text: "How has your fitness or activity level changed over the past 30 days?",
        responseType: "open_text",
        dayOnly: [30],
      },
    ],
  },

  // ==========================================
  // TIER 2: Co-Primary (Wearable + Assessment)
  // ==========================================

  // Stress Assessment
  {
    id: "reputable-stress",
    name: "Reputable Stress Assessment",
    shortName: "RSS",
    description: "Measures perceived stress levels and coping ability",
    inspiredBy: "Inspired by PSS-10 (Perceived Stress Scale)",
    checkInDays: [1, 7, 14, 21, 28],
    questions: [
      {
        id: "stress-1",
        text: "In the past week, how often have you felt that you were unable to control the important things in your life?",
        responseType: "frequency_5",
        responseOptions: FREQUENCY_5_NEVER_TO_OFTEN,
        reverseScored: true,
      },
      {
        id: "stress-2",
        text: "In the past week, how often have you felt confident about your ability to handle your personal problems?",
        responseType: "frequency_5",
        responseOptions: FREQUENCY_5_NEVER_TO_OFTEN,
      },
      {
        id: "stress-3",
        text: "In the past week, how often have you felt that things were going your way?",
        responseType: "frequency_5",
        responseOptions: FREQUENCY_5_NEVER_TO_OFTEN,
      },
      {
        id: "stress-4",
        text: "In the past week, how often have you felt difficulties were piling up so high that you could not overcome them?",
        responseType: "frequency_5",
        responseOptions: FREQUENCY_5_NEVER_TO_OFTEN,
        reverseScored: true,
      },
      {
        id: "stress-5",
        text: "In the past week, how often have you felt nervous or stressed?",
        responseType: "frequency_5",
        responseOptions: FREQUENCY_5_NEVER_TO_OFTEN,
        reverseScored: true,
      },
      {
        id: "stress-6",
        text: "In the past week, how would you rate your overall stress level?",
        responseType: "scale_10",
        responseOptions: SCALE_10,
        reverseScored: true,
        isPrimary: true,
      },
      {
        id: "stress-7",
        text: "What's your biggest source of stress right now?",
        responseType: "open_text",
        dayOnly: [1],
      },
      {
        id: "stress-8",
        text: "How has your experience of stress changed over the past 30 days?",
        responseType: "open_text",
        dayOnly: [28],
      },
    ],
  },

  // ==========================================
  // TIER 3: Assessment Primary
  // ==========================================

  // Energy / Vitality Assessment
  {
    id: "reputable-energy",
    name: "Reputable Energy Assessment",
    shortName: "REA",
    description: "Measures energy levels and vitality",
    inspiredBy: "Inspired by PROMIS Fatigue, Chalder Fatigue Scale, SF-36 Vitality",
    checkInDays: [1, 7, 14, 21, 28],
    questions: [
      {
        id: "energy-1",
        text: "In the past week, how would you rate your overall energy level?",
        responseType: "scale_10",
        responseOptions: SCALE_10,
        isPrimary: true,
      },
      {
        id: "energy-2",
        text: "In the past week, how often did you feel tired even after a full night's sleep?",
        responseType: "frequency_5",
        responseOptions: FREQUENCY_5_RARELY,
        reverseScored: true,
      },
      {
        id: "energy-3",
        text: "In the past week, how often did you experience an energy crash or slump during the day?",
        responseType: "frequency_5",
        responseOptions: FREQUENCY_5_DAYS,
        reverseScored: true,
      },
      {
        id: "energy-4",
        text: "In the past week, how much did fatigue limit your daily activities?",
        responseType: "scale_5",
        responseOptions: AFFECT_5,
        reverseScored: true,
      },
      {
        id: "energy-5",
        text: "In the past week, how would you describe your energy consistency throughout the day?",
        responseType: "scale_5",
        responseOptions: ENERGY_CONSISTENCY_5,
      },
      {
        id: "energy-6",
        text: "In the past week, how motivated did you feel to engage in your normal activities?",
        responseType: "scale_5",
        responseOptions: MOTIVATED_5,
      },
      {
        id: "energy-7",
        text: "What time of day do you typically feel lowest energy, and how does it affect you?",
        responseType: "open_text",
        dayOnly: [1],
      },
      {
        id: "energy-8",
        text: "How has your energy changed over the past 30 days?",
        responseType: "open_text",
        dayOnly: [28],
      },
    ],
  },

  // Focus / Cognition Assessment
  {
    id: "reputable-focus",
    name: "Reputable Focus Assessment",
    shortName: "RFC",
    description: "Measures mental clarity, focus, and cognitive function",
    inspiredBy: "Inspired by PROMIS Cognitive Function, CFQ",
    checkInDays: [1, 7, 14, 21, 28],
    questions: [
      {
        id: "focus-1",
        text: "In the past week, how would you rate your ability to concentrate on tasks?",
        responseType: "scale_5",
        responseOptions: QUALITY_5_EXCELLENT,
      },
      {
        id: "focus-2",
        text: "In the past week, how often did you have trouble keeping your mind on what you were doing?",
        responseType: "frequency_5",
        responseOptions: FREQUENCY_5_RARELY,
        reverseScored: true,
      },
      {
        id: "focus-3",
        text: "In the past week, how would you rate your mental clarity?",
        responseType: "scale_10",
        responseOptions: SCALE_10,
        isPrimary: true,
      },
      {
        id: "focus-4",
        text: "In the past week, how often did you forget what you were about to do or say?",
        responseType: "frequency_5",
        responseOptions: [
          { value: 0, label: "Never" },
          { value: 1, label: "Rarely" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Often" },
          { value: 4, label: "Very often" },
        ],
        reverseScored: true,
      },
      {
        id: "focus-5",
        text: "In the past week, how well were you able to think through complex problems or decisions?",
        responseType: "scale_5",
        responseOptions: [
          { value: 1, label: "Not at all well" },
          { value: 2, label: "Slightly well" },
          { value: 3, label: "Moderately well" },
          { value: 4, label: "Very well" },
          { value: 5, label: "Extremely well" },
        ],
      },
      {
        id: "focus-6",
        text: "In the past week, how would you rate your ability to stay focused during long tasks or meetings?",
        responseType: "scale_5",
        responseOptions: QUALITY_5_EXCELLENT,
      },
      {
        id: "focus-7",
        text: "When and where do you struggle most with focus or mental clarity?",
        responseType: "open_text",
        dayOnly: [1],
      },
      {
        id: "focus-8",
        text: "How has your focus or mental clarity changed over the past 30 days?",
        responseType: "open_text",
        dayOnly: [28],
      },
    ],
  },

  // Mood Assessment
  {
    id: "reputable-mood",
    name: "Reputable Mood Assessment",
    shortName: "RMA",
    description: "Measures emotional wellbeing and mood stability",
    inspiredBy: "Inspired by PANAS, POMS",
    checkInDays: [1, 7, 14, 21, 28],
    questions: [
      {
        id: "mood-1",
        text: "In the past week, how often did you feel positive, optimistic, or in good spirits?",
        responseType: "frequency_5",
        responseOptions: [
          { value: 0, label: "Never" },
          { value: 1, label: "Rarely" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Often" },
          { value: 4, label: "Very often" },
        ],
      },
      {
        id: "mood-2",
        text: "In the past week, how often did you feel down, sad, or hopeless?",
        responseType: "frequency_5",
        responseOptions: [
          { value: 0, label: "Never" },
          { value: 1, label: "Rarely" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Often" },
          { value: 4, label: "Very often" },
        ],
        reverseScored: true,
      },
      {
        id: "mood-3",
        text: "In the past week, how would you rate your overall mood?",
        responseType: "scale_10",
        responseOptions: SCALE_10,
        isPrimary: true,
      },
      {
        id: "mood-4",
        text: "In the past week, how often did you feel calm and peaceful?",
        responseType: "frequency_5",
        responseOptions: [
          { value: 0, label: "Never" },
          { value: 1, label: "Rarely" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Often" },
          { value: 4, label: "Very often" },
        ],
      },
      {
        id: "mood-5",
        text: "In the past week, how often did you feel irritable or easily frustrated?",
        responseType: "frequency_5",
        responseOptions: [
          { value: 0, label: "Never" },
          { value: 1, label: "Rarely" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Often" },
          { value: 4, label: "Very often" },
        ],
        reverseScored: true,
      },
      {
        id: "mood-6",
        text: "In the past week, how emotionally balanced or stable did you feel overall?",
        responseType: "scale_5",
        responseOptions: BALANCE_5,
      },
      {
        id: "mood-7",
        text: "What tends to have the biggest impact on your mood, positive or negative?",
        responseType: "open_text",
        dayOnly: [1],
      },
      {
        id: "mood-8",
        text: "How has your mood or emotional wellbeing changed over the past 30 days?",
        responseType: "open_text",
        dayOnly: [28],
      },
    ],
  },

  // Anxiety Assessment
  {
    id: "reputable-anxiety",
    name: "Reputable Anxiety Assessment",
    shortName: "RAA",
    description: "Measures anxiety levels and worry patterns",
    inspiredBy: "Inspired by GAD-7, STAI",
    checkInDays: [1, 7, 14, 21, 28],
    questions: [
      {
        id: "anxiety-1",
        text: "In the past week, how often have you felt nervous, anxious, or on edge?",
        responseType: "frequency_4",
        responseOptions: FREQUENCY_4_GAD,
        reverseScored: true,
      },
      {
        id: "anxiety-2",
        text: "In the past week, how often have you had trouble relaxing?",
        responseType: "frequency_4",
        responseOptions: FREQUENCY_4_GAD,
        reverseScored: true,
      },
      {
        id: "anxiety-3",
        text: "In the past week, how often have you felt restless or found it hard to sit still?",
        responseType: "frequency_4",
        responseOptions: FREQUENCY_4_GAD,
        reverseScored: true,
      },
      {
        id: "anxiety-4",
        text: "In the past week, how often have you worried too much about different things?",
        responseType: "frequency_4",
        responseOptions: FREQUENCY_4_GAD,
        reverseScored: true,
      },
      {
        id: "anxiety-5",
        text: "In the past week, how often have you felt afraid that something bad might happen?",
        responseType: "frequency_4",
        responseOptions: FREQUENCY_4_GAD,
        reverseScored: true,
      },
      {
        id: "anxiety-6",
        text: "In the past week, how would you rate your overall anxiety level?",
        responseType: "scale_10",
        responseOptions: SCALE_10,
        reverseScored: true,
        isPrimary: true,
      },
      {
        id: "anxiety-7",
        text: "What situations or triggers tend to increase your anxiety?",
        responseType: "open_text",
        dayOnly: [1],
      },
      {
        id: "anxiety-8",
        text: "How has your experience of anxiety changed over the past 30 days?",
        responseType: "open_text",
        dayOnly: [28],
      },
    ],
  },

  // Pain / Comfort Assessment
  {
    id: "reputable-pain",
    name: "Reputable Pain Assessment",
    shortName: "RPA",
    description: "Measures pain levels and impact on daily life",
    inspiredBy: "Inspired by BPI (Brief Pain Inventory), McGill Pain Questionnaire",
    checkInDays: [1, 7, 14, 21, 28],
    questions: [
      {
        id: "pain-1",
        text: "In the past week, how would you rate your pain at its WORST?",
        responseType: "scale_11",
        responseOptions: PAIN_SCALE_11,
        reverseScored: true,
      },
      {
        id: "pain-2",
        text: "In the past week, how would you rate your pain at its LEAST?",
        responseType: "scale_11",
        responseOptions: PAIN_SCALE_11,
        reverseScored: true,
      },
      {
        id: "pain-3",
        text: "In the past week, how would you rate your pain on AVERAGE?",
        responseType: "scale_11",
        responseOptions: PAIN_SCALE_11,
        reverseScored: true,
        isPrimary: true,
      },
      {
        id: "pain-4",
        text: "In the past week, how much has pain interfered with your daily activities?",
        responseType: "scale_11",
        responseOptions: INTERFERENCE_SCALE_11,
        reverseScored: true,
      },
      {
        id: "pain-5",
        text: "In the past week, how much has pain interfered with your sleep?",
        responseType: "scale_11",
        responseOptions: INTERFERENCE_SCALE_11,
        reverseScored: true,
      },
      {
        id: "pain-6",
        text: "In the past week, how much has pain affected your mood?",
        responseType: "scale_11",
        responseOptions: INTERFERENCE_SCALE_11,
        reverseScored: true,
      },
      {
        id: "pain-7",
        text: "Where do you experience pain most often, and how long have you dealt with it?",
        responseType: "open_text",
        dayOnly: [1],
      },
      {
        id: "pain-8",
        text: "How has your pain or comfort level changed over the past 30 days?",
        responseType: "open_text",
        dayOnly: [28],
      },
    ],
  },

  // ==========================================
  // TIER 4: Assessment Only
  // ==========================================

  // Skin / Beauty Assessment
  {
    id: "reputable-skin",
    name: "Reputable Skin Assessment",
    shortName: "RSK",
    description: "Measures skin health and appearance",
    inspiredBy: "Inspired by Skindex-16, DLQI",
    checkInDays: [1, 14, 28],
    requiresPhotos: true,
    questions: [
      {
        id: "skin-1",
        text: "In the past two weeks, how would you rate the overall appearance of your skin?",
        responseType: "scale_5",
        responseOptions: QUALITY_5_EXCELLENT,
        isPrimary: true,
      },
      {
        id: "skin-2",
        text: "In the past two weeks, how often did you experience skin concerns (dryness, oiliness, breakouts, redness, etc.)?",
        responseType: "frequency_5",
        responseOptions: [
          { value: 4, label: "Never" },
          { value: 3, label: "Rarely" },
          { value: 2, label: "Sometimes" },
          { value: 1, label: "Often" },
          { value: 0, label: "Constantly" },
        ],
      },
      {
        id: "skin-3",
        text: "In the past two weeks, how bothered were you by the appearance of your skin?",
        responseType: "scale_5",
        responseOptions: BOTHERED_5,
      },
      {
        id: "skin-4",
        text: "In the past two weeks, how would you rate your skin's texture and smoothness?",
        responseType: "scale_5",
        responseOptions: QUALITY_5_EXCELLENT,
      },
      {
        id: "skin-5",
        text: "In the past two weeks, how confident did you feel about your skin?",
        responseType: "scale_5",
        responseOptions: CONFIDENT_5,
      },
      {
        id: "skin-6",
        text: "In the past two weeks, how would you rate your skin's hydration?",
        responseType: "scale_5",
        responseOptions: HYDRATION_5,
      },
      {
        id: "skin-7",
        text: "Please upload a photo of the relevant skin area (same lighting and angle as previous photos).",
        responseType: "photo",
      },
      {
        id: "skin-8",
        text: "What's your primary skin concern, and how long have you been dealing with it?",
        responseType: "open_text",
        dayOnly: [1],
      },
      {
        id: "skin-9",
        text: "How has your skin changed over the past 30 days?",
        responseType: "open_text",
        dayOnly: [28],
      },
    ],
  },

  // Gut / Digestion Assessment
  {
    id: "reputable-gut",
    name: "Reputable Gut Assessment",
    shortName: "RGA",
    description: "Measures digestive comfort and gut health",
    inspiredBy: "Inspired by GSRS, IBS-SSS",
    checkInDays: [1, 7, 14, 21, 28],
    questions: [
      {
        id: "gut-1",
        text: "In the past week, how would you rate your overall digestive comfort?",
        responseType: "scale_5",
        responseOptions: QUALITY_5_EXCELLENT,
        isPrimary: true,
      },
      {
        id: "gut-2",
        text: "In the past week, how often did you experience bloating or abdominal discomfort?",
        responseType: "frequency_5",
        responseOptions: FREQUENCY_5_DAYS,
        reverseScored: true,
      },
      {
        id: "gut-3",
        text: "In the past week, how would you describe your bowel regularity?",
        responseType: "scale_5",
        responseOptions: REGULARITY_5,
      },
      {
        id: "gut-4",
        text: "In the past week, how often did you experience indigestion, heartburn, or acid reflux?",
        responseType: "frequency_5",
        responseOptions: [
          { value: 0, label: "Never" },
          { value: 1, label: "Rarely" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Often" },
          { value: 4, label: "Very often" },
        ],
        reverseScored: true,
      },
      {
        id: "gut-5",
        text: "In the past week, how often did you experience gas or flatulence?",
        responseType: "frequency_5",
        responseOptions: [
          { value: 0, label: "Never" },
          { value: 1, label: "Rarely" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Often" },
          { value: 4, label: "Very often" },
        ],
        reverseScored: true,
      },
      {
        id: "gut-6",
        text: "In the past week, how much did digestive issues interfere with your daily life?",
        responseType: "scale_5",
        responseOptions: AFFECT_5,
        reverseScored: true,
      },
      {
        id: "gut-7",
        text: "In the past week, how would you rate your appetite?",
        responseType: "scale_5",
        responseOptions: QUALITY_5_EXCELLENT,
      },
      {
        id: "gut-8",
        text: "What are your biggest digestive concerns, and how long have you experienced them?",
        responseType: "open_text",
        dayOnly: [1],
      },
      {
        id: "gut-9",
        text: "How has your digestion changed over the past 30 days?",
        responseType: "open_text",
        dayOnly: [28],
      },
    ],
  },

  // Immunity Assessment
  {
    id: "reputable-immunity",
    name: "Reputable Immunity Assessment",
    shortName: "RIA",
    description: "Measures perceived immune health and resilience",
    inspiredBy: "Inspired by WURSS, general wellness scales",
    checkInDays: [1, 14, 28],
    questions: [
      {
        id: "immunity-1",
        text: "In the past month, how many days did you feel sick or under the weather?",
        responseType: "scale_5",
        responseOptions: SICK_DAYS_5,
      },
      {
        id: "immunity-2",
        text: "In the past month, how would you rate your body's ability to fight off illness?",
        responseType: "scale_5",
        responseOptions: QUALITY_5_EXCELLENT,
        isPrimary: true,
      },
      {
        id: "immunity-3",
        text: "In the past month, how often did you experience symptoms like sore throat, congestion, or cough?",
        responseType: "frequency_5",
        responseOptions: [
          { value: 0, label: "Never" },
          { value: 1, label: "Rarely" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Often" },
          { value: 4, label: "Very often" },
        ],
        reverseScored: true,
      },
      {
        id: "immunity-4",
        text: "In the past month, how would you rate your overall sense of physical resilience?",
        responseType: "scale_5",
        responseOptions: RESILIENCE_5,
      },
      {
        id: "immunity-5",
        text: "Compared to others around you, how often do you tend to catch colds or bugs?",
        responseType: "scale_5",
        responseOptions: CATCH_ILLNESS_5,
      },
      {
        id: "immunity-6",
        text: "In the past month, how would you rate your overall health?",
        responseType: "scale_5",
        responseOptions: QUALITY_5_EXCELLENT,
      },
      {
        id: "immunity-7",
        text: "How would you describe your typical immune health, and what concerns do you have?",
        responseType: "open_text",
        dayOnly: [1],
      },
      {
        id: "immunity-8",
        text: "How has your sense of immune health or resilience changed over the past 30 days?",
        responseType: "open_text",
        dayOnly: [28],
      },
    ],
  },

  // Hair Assessment
  {
    id: "reputable-hair",
    name: "Reputable Hair Assessment",
    shortName: "RHA",
    description: "Measures hair health and appearance",
    inspiredBy: "Inspired by Kingsley Hair Assessment",
    checkInDays: [1, 14, 28],
    requiresPhotos: true,
    questions: [
      {
        id: "hair-1",
        text: "In the past two weeks, how would you rate the overall health and appearance of your hair?",
        responseType: "scale_5",
        responseOptions: QUALITY_5_EXCELLENT,
        isPrimary: true,
      },
      {
        id: "hair-2",
        text: "In the past two weeks, how much hair shedding or loss have you noticed?",
        responseType: "scale_5",
        responseOptions: SHEDDING_5,
      },
      {
        id: "hair-3",
        text: "In the past two weeks, how would you rate your hair's thickness and volume?",
        responseType: "scale_5",
        responseOptions: THICKNESS_5,
      },
      {
        id: "hair-4",
        text: "In the past two weeks, how would you rate your hair's shine and luster?",
        responseType: "scale_5",
        responseOptions: SHINE_5,
      },
      {
        id: "hair-5",
        text: "In the past two weeks, how would you rate your hair's strength (resistance to breakage)?",
        responseType: "scale_5",
        responseOptions: STRENGTH_5,
      },
      {
        id: "hair-6",
        text: "In the past two weeks, how confident did you feel about your hair?",
        responseType: "scale_5",
        responseOptions: CONFIDENT_5,
      },
      {
        id: "hair-7",
        text: "Please upload a photo of your hair (same lighting and angle as previous photos).",
        responseType: "photo",
      },
      {
        id: "hair-8",
        text: "What's your primary hair concern, and how long have you been dealing with it?",
        responseType: "open_text",
        dayOnly: [1],
      },
      {
        id: "hair-9",
        text: "How has your hair changed over the past 30 days?",
        responseType: "open_text",
        dayOnly: [28],
      },
    ],
  },

  // Weight / Metabolism Assessment
  {
    id: "reputable-weight",
    name: "Reputable Weight Assessment",
    shortName: "RWA",
    description: "Measures weight management and metabolism",
    inspiredBy: "Inspired by SF-36 items, custom wellness measures",
    checkInDays: [1, 7, 14, 21, 28],
    questions: [
      {
        id: "weight-1",
        text: "What is your current weight?",
        responseType: "numeric",
      },
      {
        id: "weight-2",
        text: "In the past week, how would you rate your appetite control?",
        responseType: "scale_5",
        responseOptions: APPETITE_CONTROL_5,
        isPrimary: true,
      },
      {
        id: "weight-3",
        text: "In the past week, how often did you experience food cravings that were hard to resist?",
        responseType: "frequency_5",
        responseOptions: [
          { value: 0, label: "Never" },
          { value: 1, label: "Rarely" },
          { value: 2, label: "Sometimes" },
          { value: 3, label: "Often" },
          { value: 4, label: "Very often" },
        ],
        reverseScored: true,
      },
      {
        id: "weight-4",
        text: "In the past week, how would you rate your energy levels related to your metabolism?",
        responseType: "scale_5",
        responseOptions: METABOLISM_ENERGY_5,
      },
      {
        id: "weight-5",
        text: "In the past week, how satisfied were you with how your body processed food?",
        responseType: "scale_5",
        responseOptions: SATISFACTION_5,
      },
      {
        id: "weight-6",
        text: "In the past week, how often did you feel uncomfortably full or bloated after meals?",
        responseType: "scale_5",
        responseOptions: BLOATED_AFTER_MEAL_5,
      },
      {
        id: "weight-7",
        text: "What are your goals related to weight or metabolism, and what's been challenging?",
        responseType: "open_text",
        dayOnly: [1],
      },
      {
        id: "weight-8",
        text: "How has your experience with weight or metabolism changed over the past 30 days?",
        responseType: "open_text",
        dayOnly: [28],
      },
    ],
  },
];

// ============================================
// 15 CATEGORY CONFIGURATIONS
// ============================================

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  // Tier 1: Wearables PRIMARY
  {
    value: "sleep",
    label: "Sleep",
    tier: 1,
    assessmentId: "reputable-sleep",
    requiresPhotos: false,
    wearableMetrics: ["sleep-quality", "deep-sleep", "rem-sleep", "resting-heart-rate"],
    checkInDays: [1, 30],
    description: "Sleep quality, duration, and recovery",
    primaryQuestionId: "sleep-1",
  },
  {
    value: "recovery",
    label: "Recovery",
    tier: 1,
    assessmentId: "reputable-recovery",
    requiresPhotos: false,
    wearableMetrics: ["recovery-score", "hrv", "resting-heart-rate"],
    checkInDays: [1, 30],
    description: "Physical recovery and readiness",
    primaryQuestionId: "recovery-1",
  },
  {
    value: "fitness",
    label: "Fitness & Activity",
    tier: 1,
    assessmentId: "reputable-fitness",
    requiresPhotos: false,
    wearableMetrics: ["steps", "energy", "recovery-score"],
    checkInDays: [1, 30],
    description: "Physical activity and fitness performance",
    primaryQuestionId: "fitness-2",
  },

  // Tier 2: Co-Primary
  {
    value: "stress",
    label: "Stress",
    tier: 2,
    assessmentId: "reputable-stress",
    requiresPhotos: false,
    wearableMetrics: ["hrv", "resting-heart-rate", "stress"],
    checkInDays: [1, 7, 14, 21, 28],
    description: "Stress levels and coping ability",
    primaryQuestionId: "stress-6",
  },

  // Tier 3: Assessment PRIMARY
  {
    value: "energy",
    label: "Energy & Vitality",
    tier: 3,
    assessmentId: "reputable-energy",
    requiresPhotos: false,
    wearableMetrics: ["steps", "energy", "sleep-quality"],
    checkInDays: [1, 7, 14, 21, 28],
    description: "Energy levels and daily vitality",
    primaryQuestionId: "energy-1",
  },
  {
    value: "focus",
    label: "Focus & Cognition",
    tier: 3,
    assessmentId: "reputable-focus",
    requiresPhotos: false,
    wearableMetrics: ["sleep-quality", "hrv"],
    checkInDays: [1, 7, 14, 21, 28],
    description: "Mental clarity and cognitive function",
    primaryQuestionId: "focus-3",
  },
  {
    value: "mood",
    label: "Mood",
    tier: 3,
    assessmentId: "reputable-mood",
    requiresPhotos: false,
    wearableMetrics: ["sleep-quality", "steps", "hrv"],
    checkInDays: [1, 7, 14, 21, 28],
    description: "Emotional wellbeing and mood stability",
    primaryQuestionId: "mood-3",
  },
  {
    value: "anxiety",
    label: "Anxiety",
    tier: 3,
    assessmentId: "reputable-anxiety",
    requiresPhotos: false,
    wearableMetrics: ["hrv", "resting-heart-rate", "sleep-quality"],
    checkInDays: [1, 7, 14, 21, 28],
    description: "Anxiety levels and calmness",
    primaryQuestionId: "anxiety-6",
  },
  {
    value: "pain",
    label: "Pain & Comfort",
    tier: 3,
    assessmentId: "reputable-pain",
    requiresPhotos: false,
    wearableMetrics: ["steps", "sleep-quality"],
    checkInDays: [1, 7, 14, 21, 28],
    description: "Pain levels and physical comfort",
    primaryQuestionId: "pain-3",
  },

  // Tier 4: Assessment Only
  {
    value: "skin",
    label: "Skin & Beauty",
    tier: 4,
    assessmentId: "reputable-skin",
    requiresPhotos: true,
    wearableMetrics: ["sleep-quality"],
    checkInDays: [1, 14, 28],
    description: "Skin health and appearance",
    primaryQuestionId: "skin-1",
  },
  {
    value: "gut",
    label: "Gut & Digestion",
    tier: 4,
    assessmentId: "reputable-gut",
    requiresPhotos: false,
    wearableMetrics: ["stress", "sleep-quality"],
    checkInDays: [1, 7, 14, 21, 28],
    description: "Digestive health and gut comfort",
    primaryQuestionId: "gut-1",
  },
  {
    value: "immunity",
    label: "Immunity",
    tier: 4,
    assessmentId: "reputable-immunity",
    requiresPhotos: false,
    wearableMetrics: ["hrv", "sleep-quality"],
    checkInDays: [1, 14, 28],
    description: "Immune health and resilience",
    primaryQuestionId: "immunity-2",
  },
  {
    value: "hair",
    label: "Hair",
    tier: 4,
    assessmentId: "reputable-hair",
    requiresPhotos: true,
    wearableMetrics: [],
    checkInDays: [1, 14, 28],
    description: "Hair health and appearance",
    primaryQuestionId: "hair-1",
  },
  {
    value: "weight",
    label: "Weight & Metabolism",
    tier: 4,
    assessmentId: "reputable-weight",
    requiresPhotos: false,
    wearableMetrics: ["steps", "energy"],
    checkInDays: [1, 7, 14, 21, 28],
    description: "Weight management and metabolism",
    primaryQuestionId: "weight-2",
  },
  {
    value: "libido",
    label: "Sexual Wellness",
    tier: 4,
    assessmentId: "reputable-weight", // Using weight assessment as placeholder (user didn't provide specific libido questions)
    requiresPhotos: false,
    wearableMetrics: ["sleep-quality", "stress"],
    checkInDays: [1, 7, 14, 21, 28],
    description: "Sexual health and wellness",
    primaryQuestionId: "weight-2",
  },
];

// ============================================
// SCORING FUNCTIONS
// ============================================

/**
 * Normalize a 5-point scale (1-5) to 0-100
 */
export function normalize5Point(raw: number): number {
  return ((raw - 1) / 4) * 100;
}

/**
 * Normalize a 10-point scale (1-10) to 0-100
 */
export function normalize10Point(raw: number): number {
  return ((raw - 1) / 9) * 100;
}

/**
 * Normalize an 11-point scale (0-10) to 0-100
 */
export function normalize11Point(raw: number): number {
  return (raw / 10) * 100;
}

/**
 * Normalize a 5-point frequency scale (0-4) to 0-100
 */
export function normalizeFrequency5(raw: number, isReverse: boolean): number {
  const normalized = (raw / 4) * 100;
  return isReverse ? 100 - normalized : normalized;
}

/**
 * Normalize a 4-point frequency scale (0-3, GAD-7 style) to 0-100
 */
export function normalizeFrequency4(raw: number, isReverse: boolean): number {
  const normalized = (raw / 3) * 100;
  return isReverse ? 100 - normalized : normalized;
}

/**
 * Normalize any response to 0-100 based on response type
 */
export function normalizeResponse(
  rawValue: number,
  responseType: ResponseType,
  isReverseScored: boolean = false
): number {
  let normalized: number;

  switch (responseType) {
    case 'scale_5':
      normalized = normalize5Point(rawValue);
      break;
    case 'scale_10':
      normalized = normalize10Point(rawValue);
      break;
    case 'scale_11':
      normalized = normalize11Point(rawValue);
      break;
    case 'frequency_5':
      return normalizeFrequency5(rawValue, isReverseScored);
    case 'frequency_4':
      return normalizeFrequency4(rawValue, isReverseScored);
    default:
      return 0;
  }

  // Apply reverse scoring for non-frequency types
  return isReverseScored ? 100 - normalized : normalized;
}

/**
 * Calculate composite score from normalized scores
 */
export function calculateCompositeScore(normalizedScores: number[]): number {
  if (normalizedScores.length === 0) return 0;
  const sum = normalizedScores.reduce((a, b) => a + b, 0);
  return Math.round(sum / normalizedScores.length);
}

/**
 * Calculate percentage change
 */
export function calculatePercentChange(baseline: number, endpoint: number): number {
  if (baseline === 0) return endpoint > 0 ? 100 : 0;
  return Math.round(((endpoint - baseline) / baseline) * 100);
}

/**
 * Get max value for a response type (for displaying X/max format)
 */
export function getMaxForResponseType(responseType: ResponseType): number {
  switch (responseType) {
    case 'scale_5':
      return 5;
    case 'scale_10':
      return 10;
    case 'scale_11':
      return 10; // 0-10 scale, displayed as X/10
    case 'frequency_5':
      return 5;
    case 'frequency_4':
      return 4;
    default:
      return 10;
  }
}

/**
 * Generate marketing-ready headline for assessment result
 * Format: "Energy improved from 4/10 to 8/10 (+100%)"
 */
export function generateHeadline(
  categoryLabel: string,
  baselineRaw: number,
  endpointRaw: number,
  maxValue: number,
  percentChange: number
): string {
  const direction = percentChange >= 0 ? 'improved' : 'declined';
  const changeSign = percentChange >= 0 ? '+' : '';

  return `${categoryLabel} ${direction} from ${baselineRaw}/${maxValue} to ${endpointRaw}/${maxValue} (${changeSign}${percentChange}%)`;
}

/**
 * Calculate full assessment result from responses
 */
export function calculateAssessmentResult(
  assessment: ReputableAssessment,
  baselineResponses: { questionId: string; value: number }[],
  endpointResponses: { questionId: string; value: number }[],
  categoryLabel?: string
): AssessmentResult | null {
  if (baselineResponses.length === 0 || endpointResponses.length === 0) return null;

  const primaryQuestion = assessment.questions.find(q => q.isPrimary);

  const normalizeResponses = (responses: { questionId: string; value: number }[]): number[] => {
    return responses.map(response => {
      const question = assessment.questions.find(q => q.id === response.questionId);
      if (!question || question.responseType === 'open_text' || question.responseType === 'photo' || question.responseType === 'numeric') {
        return -1; // Skip non-scorable questions
      }
      return normalizeResponse(response.value, question.responseType, question.reverseScored);
    }).filter(score => score >= 0);
  };

  const baselineNormalized = normalizeResponses(baselineResponses);
  const endpointNormalized = normalizeResponses(endpointResponses);

  const baselineComposite = calculateCompositeScore(baselineNormalized);
  const endpointComposite = calculateCompositeScore(endpointNormalized);

  // Get primary scores (both normalized and raw)
  const baselinePrimaryResponse = baselineResponses.find(r => r.questionId === primaryQuestion?.id);
  const endpointPrimaryResponse = endpointResponses.find(r => r.questionId === primaryQuestion?.id);

  let baselinePrimary = 0;
  let endpointPrimary = 0;
  let baselinePrimaryRaw = 0;
  let endpointPrimaryRaw = 0;
  let primaryMax = 10;

  if (primaryQuestion && baselinePrimaryResponse && endpointPrimaryResponse) {
    baselinePrimary = normalizeResponse(
      baselinePrimaryResponse.value,
      primaryQuestion.responseType,
      primaryQuestion.reverseScored
    );
    endpointPrimary = normalizeResponse(
      endpointPrimaryResponse.value,
      primaryQuestion.responseType,
      primaryQuestion.reverseScored
    );
    baselinePrimaryRaw = baselinePrimaryResponse.value;
    endpointPrimaryRaw = endpointPrimaryResponse.value;
    primaryMax = getMaxForResponseType(primaryQuestion.responseType);
  }

  // Calculate percent change for headline (using raw values)
  const primaryPercentChange = calculatePercentChange(baselinePrimaryRaw, endpointPrimaryRaw);

  // Derive category label from assessment name if not provided
  const derivedCategoryLabel = categoryLabel ||
    assessment.name.replace('Reputable ', '').replace(' Assessment', '');

  // Generate marketing headline
  const headline = generateHeadline(
    derivedCategoryLabel,
    baselinePrimaryRaw,
    endpointPrimaryRaw,
    primaryMax,
    primaryPercentChange
  );

  return {
    assessmentId: assessment.id,
    assessmentName: assessment.name,
    categoryLabel: derivedCategoryLabel,
    baseline: {
      date: new Date(),
      compositeScore: baselineComposite,
      primaryScore: baselinePrimary,
      primaryRaw: baselinePrimaryRaw,
      primaryMax: primaryMax,
      responses: [],
    },
    endpoint: {
      date: new Date(),
      compositeScore: endpointComposite,
      primaryScore: endpointPrimary,
      primaryRaw: endpointPrimaryRaw,
      primaryMax: primaryMax,
      responses: [],
    },
    change: {
      compositePoints: endpointComposite - baselineComposite,
      compositePercent: calculatePercentChange(baselineComposite, endpointComposite),
      primaryPoints: endpointPrimary - baselinePrimary,
      primaryPercent: calculatePercentChange(baselinePrimary, endpointPrimary),
    },
    improved: endpointComposite > baselineComposite,
    headline,
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get category configuration by value
 */
export function getCategoryConfig(category: string): CategoryConfig | undefined {
  return CATEGORY_CONFIGS.find((c) => c.value === category);
}

/**
 * Get tier level for a category
 */
export function getTierForCategory(category: string): TierLevel {
  const config = getCategoryConfig(category);
  return config?.tier || 1;
}

/**
 * Get assessment for a category
 */
export function getAssessmentForCategory(category: string): ReputableAssessment | null {
  const config = getCategoryConfig(category);
  if (!config?.assessmentId) return null;
  return REPUTABLE_ASSESSMENTS.find((a) => a.id === config.assessmentId) || null;
}

/**
 * Get assessment by ID
 */
export function getAssessmentById(assessmentId: string): ReputableAssessment | undefined {
  return REPUTABLE_ASSESSMENTS.find((a) => a.id === assessmentId);
}

/**
 * Get score interpretation label (0-100 scale)
 */
export function getScoreLabel(score: number): string {
  const interpretation = SCORE_INTERPRETATIONS.find(
    (i) => score >= i.minScore && score <= i.maxScore
  );
  return interpretation?.label || "Unknown";
}

/**
 * Get score interpretation color (0-100 scale)
 */
export function getScoreColor(score: number): string {
  const interpretation = SCORE_INTERPRETATIONS.find(
    (i) => score >= i.minScore && score <= i.maxScore
  );
  return interpretation?.color || "gray";
}

/**
 * Get tier display info
 */
export function getTierDisplayInfo(tier: TierLevel): {
  label: string;
  badge: string;
  description: string;
} {
  switch (tier) {
    case 1:
      return {
        label: "Wearables Primary",
        badge: "PRIMARY",
        description: "Wearable data directly measures your outcome",
      };
    case 2:
      return {
        label: "Co-Primary",
        badge: "CO-PRIMARY",
        description: "Both wearable data and assessment measure your outcome",
      };
    case 3:
      return {
        label: "Assessment Primary",
        badge: "PRIMARY",
        description: "Assessment measures your outcome, wearables validate engagement",
      };
    case 4:
      return {
        label: "Assessment Only",
        badge: "PRIMARY",
        description: "Assessment measures your outcome, wearables prove participation",
      };
  }
}

/**
 * Get categories grouped by tier
 */
export function getCategoriesByTier(): Record<TierLevel, CategoryConfig[]> {
  return {
    1: CATEGORY_CONFIGS.filter((c) => c.tier === 1),
    2: CATEGORY_CONFIGS.filter((c) => c.tier === 2),
    3: CATEGORY_CONFIGS.filter((c) => c.tier === 3),
    4: CATEGORY_CONFIGS.filter((c) => c.tier === 4),
  };
}

/**
 * Get questions for a specific day
 */
export function getQuestionsForDay(assessment: ReputableAssessment, day: number): AssessmentQuestion[] {
  return assessment.questions.filter(q => {
    if (!q.dayOnly) return true;
    return q.dayOnly.includes(day);
  });
}

/**
 * Get scorable questions (exclude open text, photos, numeric)
 */
export function getScorableQuestions(assessment: ReputableAssessment): AssessmentQuestion[] {
  return assessment.questions.filter(q =>
    q.responseType !== 'open_text' &&
    q.responseType !== 'photo' &&
    q.responseType !== 'numeric'
  );
}

/**
 * Get primary question for an assessment
 */
export function getPrimaryQuestion(assessment: ReputableAssessment): AssessmentQuestion | undefined {
  return assessment.questions.find(q => q.isPrimary);
}

/**
 * Default testimonial questions for Tier 1 categories
 */
export const TIER_1_TESTIMONIAL_QUESTIONS = [
  {
    day: 1,
    question: "What's your biggest challenge with [category] right now?",
    type: "voice_and_text" as const,
  },
  {
    day: 30,
    question: "How has your [category] changed over the past month?",
    type: "voice_and_text" as const,
  },
  {
    day: 30,
    question: "What surprised you most about this experience?",
    type: "voice_and_text" as const,
  },
];
