import { DiscoverItem, RoutineStep, ValueItem } from "./study-context";

interface GenerateContentInput {
  productName: string;
  productDescription: string;
  productPrice: string;
  category: string;
  rebateAmount: string;
  durationDays: string;
  metricsToTrack: string[];
}

interface GeneratedContent {
  studyTitle: string;
  hookQuestion: string;
  discoverItems: DiscoverItem[];
  dailyRoutine: RoutineStep[];
  whatYouGet: ValueItem[];
}

const categoryTitles: Record<string, string> = {
  sleep: "Better Sleep Study",
  stress: "Stress Relief Study",
  energy: "Energy Boost Study",
  recovery: "Recovery Study",
  fitness: "Fitness Study",
  nutrition: "Nutrition Study",
  skin: "Skin Health Study",
};

const categoryHooks: Record<string, string> = {
  sleep: `Does {product} actually help YOU sleep better?`,
  stress: `Can {product} really reduce YOUR daily stress?`,
  energy: `Does {product} give YOU more sustained energy?`,
  recovery: `Can {product} speed up YOUR recovery?`,
  fitness: `Does {product} improve YOUR fitness results?`,
  nutrition: `Can {product} transform YOUR nutrition?`,
  skin: `Does {product} actually improve YOUR skin?`,
};

const categoryDiscoverItems: Record<string, DiscoverItem[]> = {
  sleep: [
    { question: "Does YOUR sleep quality actually improve?", explanation: "Track real changes in your deep sleep and REM cycles over 30 days" },
    { question: "Do YOU fall asleep faster with this routine?", explanation: "See if your time to sleep decreases with consistent use" },
    { question: "Does YOUR morning energy improve?", explanation: "Monitor your recovery scores and morning readiness" },
    { question: "Is a bedtime ritual worth it for YOU?", explanation: "See if this simple habit makes a real difference" },
  ],
  stress: [
    { question: "Does YOUR stress actually decrease?", explanation: "Track real changes in your HRV and stress scores" },
    { question: "Do YOU feel calmer throughout the day?", explanation: "Monitor your daily stress patterns and trends" },
    { question: "Does YOUR heart rate variability improve?", explanation: "See objective improvements in your nervous system balance" },
    { question: "Is this practice worth YOUR time?", explanation: "Measure the real impact on your wellbeing" },
  ],
  energy: [
    { question: "Does YOUR energy actually increase?", explanation: "Track your energy levels throughout the day" },
    { question: "Do YOU experience fewer afternoon slumps?", explanation: "See if your energy stays consistent" },
    { question: "Does YOUR recovery improve?", explanation: "Monitor how well your body bounces back" },
    { question: "Is this supplement worth it for YOU?", explanation: "Measure real changes in your daily vitality" },
  ],
  recovery: [
    { question: "Does YOUR recovery score improve?", explanation: "Track objective improvements in your body's recovery" },
    { question: "Do YOU bounce back faster?", explanation: "See changes in your post-workout recovery time" },
    { question: "Does YOUR sleep quality support recovery?", explanation: "Monitor the connection between rest and recovery" },
    { question: "Is this worth adding to YOUR routine?", explanation: "Measure the real impact on your performance" },
  ],
  fitness: [
    { question: "Do YOUR fitness metrics improve?", explanation: "Track changes in your performance data" },
    { question: "Does YOUR endurance increase?", explanation: "See improvements in your activity levels" },
    { question: "Does YOUR recovery support YOUR training?", explanation: "Monitor how well you bounce back between sessions" },
    { question: "Is this effective for YOUR goals?", explanation: "Measure real progress in your fitness journey" },
  ],
  nutrition: [
    { question: "Does YOUR energy improve with this?", explanation: "Track how nutrition affects your daily energy" },
    { question: "Do YOU feel better overall?", explanation: "Monitor changes in your wellbeing markers" },
    { question: "Does YOUR sleep improve?", explanation: "See how nutrition impacts your rest" },
    { question: "Is this diet change worth it for YOU?", explanation: "Measure the real impact on your health" },
  ],
  skin: [
    { question: "Does YOUR skin actually improve?", explanation: "Track visible changes with photo documentation" },
    { question: "Do YOU see results in 30 days?", explanation: "Monitor your skin's transformation journey" },
    { question: "Does YOUR confidence increase?", explanation: "See how skin improvements affect your wellbeing" },
    { question: "Is this skincare worth YOUR investment?", explanation: "Measure real changes in your skin health" },
  ],
};

const categoryRoutines: Record<string, RoutineStep[]> = {
  sleep: [
    { action: "Use your product", details: "Follow the recommended usage before bed" },
    { action: "Wear your wearable", details: "Tracks your sleep automatically overnight" },
    { action: "Quick daily check-in", details: "~1 minute in the Reputable app" },
  ],
  stress: [
    { action: "Complete your practice", details: "Use the product as directed" },
    { action: "Wear your wearable", details: "Tracks your stress levels throughout the day" },
    { action: "Quick daily check-in", details: "~1 minute in the Reputable app" },
  ],
  energy: [
    { action: "Take your supplement", details: "As directed, typically in the morning" },
    { action: "Wear your wearable", details: "Tracks your energy and activity levels" },
    { action: "Quick daily check-in", details: "~1 minute in the Reputable app" },
  ],
  recovery: [
    { action: "Use your recovery tool", details: "Follow the recommended protocol" },
    { action: "Wear your wearable", details: "Tracks your recovery scores automatically" },
    { action: "Quick daily check-in", details: "~1 minute in the Reputable app" },
  ],
  fitness: [
    { action: "Follow your program", details: "Use the product as directed" },
    { action: "Wear your wearable", details: "Tracks your fitness metrics" },
    { action: "Quick daily check-in", details: "~1 minute in the Reputable app" },
  ],
  nutrition: [
    { action: "Follow your nutrition plan", details: "Consume as directed" },
    { action: "Wear your wearable", details: "Tracks how nutrition affects your body" },
    { action: "Quick daily check-in", details: "~1 minute in the Reputable app" },
  ],
  skin: [
    { action: "Apply your skincare", details: "Follow the recommended routine" },
    { action: "Take progress photos", details: "Weekly in the Reputable app" },
    { action: "Quick daily check-in", details: "~1 minute in the Reputable app" },
  ],
};

export function generateStudyContent(input: GenerateContentInput): GeneratedContent {
  const category = input.category || "sleep";
  const productName = input.productName || "Your Product";
  const productPrice = parseFloat(input.productPrice) || 0;
  const rebateAmount = parseFloat(input.rebateAmount) || 0;
  const durationDays = input.durationDays || "30";

  // Generate title
  const studyTitle = input.productName
    ? `${input.productName} Study`
    : categoryTitles[category] || "Wellness Study";

  // Generate hook question
  const hookTemplate = categoryHooks[category] || categoryHooks.sleep;
  const hookQuestion = hookTemplate.replace("{product}", productName);

  // Get discover items for category
  const discoverItems = categoryDiscoverItems[category] || categoryDiscoverItems.sleep;

  // Get routine for category
  const dailyRoutine = categoryRoutines[category] || categoryRoutines.sleep;

  // Build what you get items
  const whatYouGet: ValueItem[] = [
    {
      item: productName,
      value: productPrice > 0 ? `$${productPrice.toFixed(0)}` : "Included",
      note: "Yours to keep forever",
    },
    {
      item: "Cash Back Rebate",
      value: rebateAmount > 0 ? `$${rebateAmount.toFixed(0)}` : "$0",
      note: "Upon completion",
    },
    {
      item: `Personal ${durationDays}-Day Report`,
      value: "Free",
      note: "Your transformation data",
    },
  ];

  return {
    studyTitle,
    hookQuestion,
    discoverItems,
    dailyRoutine,
    whatYouGet,
  };
}

export function regenerateSection(
  section: "title" | "discover" | "routine",
  input: GenerateContentInput
): Partial<GeneratedContent> {
  const fullContent = generateStudyContent(input);

  switch (section) {
    case "title":
      return {
        studyTitle: fullContent.studyTitle,
        hookQuestion: fullContent.hookQuestion,
      };
    case "discover":
      return { discoverItems: fullContent.discoverItems };
    case "routine":
      return { dailyRoutine: fullContent.dailyRoutine };
    default:
      return {};
  }
}
