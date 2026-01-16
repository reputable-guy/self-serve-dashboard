"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  Check,
  Star,
  BadgeCheck,
  Watch,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  Share2,
  Activity,
  Heart,
  Moon,
  User,
  Quote,
  X,
  CheckCircle2,
  BarChart3,
  Calendar,
  MapPin,
  Smartphone,
  Zap,
  Target,
  MessageSquare,
  Clock,
  Info,
} from "lucide-react";
import { MockTestimonial, ParticipantStory } from "@/lib/mock-data";
import { TierLevel, getTierDisplayInfo } from "@/lib/assessments";

// Reputable Health Seal Component
function ReputableSeal({ size = "lg" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { outer: "h-16 w-16", shield: "h-8 w-8", check: "h-4 w-4" },
    md: { outer: "h-24 w-24", shield: "h-12 w-12", check: "h-6 w-6" },
    lg: { outer: "h-32 w-32", shield: "h-16 w-16", check: "h-8 w-8" },
  };

  return (
    <div className={`${sizes[size].outer} relative`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00D1C1] to-[#00A89D] animate-pulse opacity-20" />
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center shadow-lg">
        <div className="relative">
          <Shield className={`${sizes[size].shield} text-white`} />
          <Check className={`${sizes[size].check} text-white absolute inset-0 m-auto`} />
        </div>
      </div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white rounded-full px-2 py-0.5 shadow-md border border-[#00D1C1]/20">
        <span className="text-[10px] font-bold text-[#00D1C1] uppercase tracking-wide">Verified</span>
      </div>
    </div>
  );
}

// Inline verification badge - small trust signal
function InlineVerifiedBadge({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-[#00D1C1] bg-[#00D1C1]/10 px-2 py-0.5 rounded-full">
      <CheckCircle2 className="h-3 w-3" />
      {label || "Verified"}
    </span>
  );
}

// Timeline event component
function TimelineEvent({
  date,
  title,
  description,
  icon: Icon,
  isLast = false,
}: {
  date: string;
  title: string;
  description: string;
  icon: React.ElementType;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 rounded-full bg-[#00D1C1]/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-[#00D1C1]" />
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-[#00D1C1]/20 my-2" />}
      </div>
      <div className="flex-1 pb-6">
        <p className="text-xs text-muted-foreground">{date}</p>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// Metric card with before/after
function MetricCard({
  label,
  before,
  after,
  change,
  icon: Icon,
}: {
  label: string;
  before: string;
  after: string;
  change: string;
  icon: React.ElementType;
}) {
  const isPositive = change.startsWith("+") || change.startsWith("-");

  return (
    <div className="bg-white rounded-xl border p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-[#00D1C1]/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-[#00D1C1]" />
        </div>
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Before</p>
          <p className="text-lg font-semibold text-muted-foreground">{before}</p>
        </div>
        <div className="text-center px-4">
          <TrendingUp className="h-5 w-5 text-[#00D1C1] mx-auto" />
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">After</p>
          <p className="text-lg font-semibold">{after}</p>
        </div>
      </div>
      <div className="text-center">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
          isPositive ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
        }`}>
          {change}
        </span>
      </div>
    </div>
  );
}

// Assessment Result Card - for tiers 2-4 (0-100 scoring)
function AssessmentResultCard({
  assessmentName,
  baselineScore,
  endpointScore,
  changePercent,
  headline,
  isPrimary = false,
}: {
  assessmentName: string;
  baselineScore: number; // 0-100 scale
  endpointScore: number; // 0-100 scale
  changePercent: number;
  headline?: string; // Marketing-ready headline, e.g., "Energy improved from 4/10 to 8/10 (+100%)"
  isPrimary?: boolean;
}) {
  // Get labels based on 0-100 score ranges
  const getScoreLabelAndColor = (score: number) => {
    if (score >= 75) return { label: "Excellent", color: "text-emerald-600 bg-emerald-50" };
    if (score >= 50) return { label: "Good", color: "text-green-600 bg-green-50" };
    if (score >= 25) return { label: "Fair", color: "text-yellow-600 bg-yellow-50" };
    return { label: "Poor", color: "text-red-600 bg-red-50" };
  };

  const baselineInfo = getScoreLabelAndColor(baselineScore);
  const endpointInfo = getScoreLabelAndColor(endpointScore);

  return (
    <div className={`rounded-xl border p-6 space-y-4 ${isPrimary ? 'bg-gradient-to-br from-purple-50 to-white border-purple-200' : 'bg-white'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isPrimary ? 'bg-purple-100' : 'bg-[#00D1C1]/10'}`}>
            <BarChart3 className={`h-5 w-5 ${isPrimary ? 'text-purple-600' : 'text-[#00D1C1]'}`} />
          </div>
          <div>
            <span className="font-semibold">{assessmentName}</span>
            {isPrimary && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                PRIMARY
              </span>
            )}
          </div>
        </div>
        <InlineVerifiedBadge label="Validated" />
      </div>

      {/* Headline - marketing-ready summary */}
      {headline && (
        <div className="text-center py-2 px-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-lg font-semibold text-green-700">{headline}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-8">
        <div className="text-center flex-1">
          <p className="text-xs text-muted-foreground mb-1">Baseline</p>
          <p className="text-3xl font-bold text-muted-foreground">{baselineScore}<span className="text-lg">/100</span></p>
          <span className={`text-xs px-2 py-0.5 rounded-full ${baselineInfo.color}`}>
            {baselineInfo.label}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <TrendingUp className="h-8 w-8 text-green-500" />
          <span className="text-lg font-bold text-green-600">+{changePercent}%</span>
        </div>

        <div className="text-center flex-1">
          <p className="text-xs text-muted-foreground mb-1">After Study</p>
          <p className="text-3xl font-bold text-foreground">{endpointScore}<span className="text-lg">/100</span></p>
          <span className={`text-xs px-2 py-0.5 rounded-full ${endpointInfo.color}`}>
            {endpointInfo.label}
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Composite score from normalized assessment responses (0-100 scale)
      </p>
    </div>
  );
}

// Tier badge component (kept for potential future use)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TierBadge({ tier }: { tier: TierLevel }) {
  const info = getTierDisplayInfo(tier);
  const colors = {
    1: "bg-blue-100 text-blue-700 border-blue-200",
    2: "bg-purple-100 text-purple-700 border-purple-200",
    3: "bg-green-100 text-green-700 border-green-200",
    4: "bg-orange-100 text-orange-700 border-orange-200",
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${colors[tier]}`}>
      {info.label}
    </span>
  );
}

// Testimonial responses section for Tier 1
function TestimonialResponsesSection({
  responses,
}: {
  responses: ParticipantStory["testimonialResponses"];
}) {
  if (!responses || responses.length === 0) return null;

  return (
    <div className="space-y-4">
      {responses.map((r, idx) => (
        <div key={idx} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              Day {r.day}
            </span>
            <span className="text-sm font-medium text-purple-900">{r.question}</span>
          </div>
          <p className="text-sm italic text-purple-800">&ldquo;{r.response}&rdquo;</p>
        </div>
      ))}
    </div>
  );
}

// Villain Journey Progress component
function VillainJourneyProgress({ ratings, villainVariable }: {
  ratings: ParticipantStory["journey"]["villainRatings"];
  villainVariable: string
}) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-500";
    if (rating >= 3) return "bg-yellow-500";
    return "bg-red-400";
  };

  const getRatingLabel = (rating: number) => {
    if (rating === 5) return "Much better";
    if (rating === 4) return "Better";
    if (rating === 3) return "Same";
    if (rating === 2) return "Worse";
    return "Much worse";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <TrendingUp className="h-4 w-4 text-[#00D1C1]" />
        <span className="capitalize">{villainVariable} Progress</span>
      </div>
      <div className="space-y-3">
        {ratings.map((r) => (
          <div key={r.day} className="flex items-center gap-4">
            <div className="w-16 text-sm text-muted-foreground">Day {r.day}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getRatingColor(r.rating)} transition-all`}
                    style={{ width: `${(r.rating / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${r.rating >= 4 ? "text-green-600" : r.rating >= 3 ? "text-yellow-600" : "text-red-500"}`}>
                  {getRatingLabel(r.rating)}
                </span>
              </div>
              {r.note && (
                <p className="text-xs text-muted-foreground mt-1 italic">&ldquo;{r.note}&rdquo;</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Comparison Table Component
function ComparisonTable() {
  const comparisons = [
    { feature: "Real person verified", amazon: false, brand: false, reputable: true },
    { feature: "Real participation tracked", amazon: false, brand: false, reputable: true },
    { feature: "No incentive to lie", amazon: false, brand: false, reputable: true },
    { feature: "Independent collection", amazon: false, brand: false, reputable: true },
    { feature: "Brand cannot edit results", amazon: false, brand: false, reputable: true },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground"></th>
            <th className="text-center py-3 px-4 font-medium">
              <div className="text-muted-foreground">Amazon Reviews</div>
            </th>
            <th className="text-center py-3 px-4 font-medium">
              <div className="text-muted-foreground">Brand Testimonials</div>
            </th>
            <th className="text-center py-3 px-4 font-medium">
              <div className="text-[#00D1C1]">Reputable</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {comparisons.map((row) => (
            <tr key={row.feature} className="border-b last:border-0">
              <td className="py-3 px-4 text-muted-foreground">{row.feature}</td>
              <td className="py-3 px-4 text-center">
                {row.amazon ? (
                  <Check className="h-4 w-4 text-green-500 mx-auto" />
                ) : (
                  <X className="h-4 w-4 text-red-400 mx-auto" />
                )}
              </td>
              <td className="py-3 px-4 text-center">
                {row.brand ? (
                  <Check className="h-4 w-4 text-green-500 mx-auto" />
                ) : (
                  <X className="h-4 w-4 text-red-400 mx-auto" />
                )}
              </td>
              <td className="py-3 px-4 text-center">
                {row.reputable ? (
                  <Check className="h-4 w-4 text-[#00D1C1] mx-auto" />
                ) : (
                  <X className="h-4 w-4 text-red-400 mx-auto" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Trust Stack Pillar Component
function TrustStackPillar({
  icon,
  title,
  description,
  variant = "default",
}: {
  icon: string;
  title: string;
  description: string;
  variant?: "default" | "muted";
}) {
  const bgClass = variant === "muted"
    ? "bg-gray-50 border-gray-200"
    : "bg-green-50 border-green-200";
  const titleClass = variant === "muted"
    ? "text-gray-700"
    : "text-green-900";
  const textClass = variant === "muted"
    ? "text-gray-600"
    : "text-green-800";

  return (
    <div className={`p-4 rounded-lg border ${bgClass}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className={`font-medium ${titleClass}`}>{title}</span>
      </div>
      <p className={`text-sm ${textClass}`}>{description}</p>
    </div>
  );
}

// How We Verify Modal/Expandable Section - detailed content for skeptics
function HowWeVerifySection({
  testimonial,
  formattedDataPoints,
  studyDuration,
  hasWearable = true,
}: {
  testimonial: MockTestimonial;
  formattedDataPoints: string;
  studyDuration: number;
  hasWearable?: boolean;
}) {
  const [showRawData, setShowRawData] = useState(false);

  // Build Trust Stack pillars based on participant type
  const trustStackPillars = hasWearable ? [
    {
      icon: "👤",
      title: "Real Person",
      description: "Identity verified via account authentication. Not a bot, paid reviewer, or brand employee.",
    },
    {
      icon: "⌚",
      title: "Real Device",
      description: `${testimonial.device} connected via API. ${formattedDataPoints} data points collected automatically.`,
    },
    {
      icon: "📅",
      title: "Real Participation",
      description: `${studyDuration} days active participation. Rebate given regardless of feedback.`,
    },
    {
      icon: "📊",
      title: "Real Results",
      description: "Device data collected automatically. Self-reports given with no incentive to exaggerate. The brand cannot edit any results.",
    },
  ] : [
    {
      icon: "👤",
      title: "Real Person",
      description: "Identity verified via account authentication. Not a bot, paid reviewer, or brand employee.",
    },
    {
      icon: "📋",
      title: "Structured Assessment",
      description: "Validated questionnaire completed at baseline and endpoint. Scientifically-backed methodology.",
    },
    {
      icon: "📅",
      title: "Real Participation",
      description: `${studyDuration} days of consistent engagement. Weekly check-ins tracked and verified.`,
    },
    {
      icon: "💰",
      title: "No Incentive to Lie",
      description: "Same rebate given regardless of results. No bonus for positive feedback. Brand cannot edit any data.",
    },
  ];

  return (
    <div className="space-y-6 pt-4">
      {/* Trust Stack - 4 pillars with distinct icons */}
      <div className="grid md:grid-cols-2 gap-4">
        {trustStackPillars.map((pillar) => (
          <TrustStackPillar key={pillar.title} {...pillar} />
        ))}
      </div>

      {/* Comparison table */}
      <div>
        <h4 className="font-medium mb-3">How we&apos;re different from other reviews:</h4>
        <ComparisonTable />
      </div>

      {/* About Reputable */}
      <div className="p-4 bg-muted/30 rounded-lg border space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#00D1C1]" />
          <span className="font-medium">About Reputable Health</span>
        </div>
        <p className="text-sm text-muted-foreground">
          We&apos;re a third-party verification platform. Brands pay us to collect unbiased data — but they
          cannot edit the results. If a product doesn&apos;t work, our data will show that.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-medium">147+ studies</span>
          <span className="text-muted-foreground">•</span>
          <span className="font-medium">12,400+ participants</span>
          <span className="text-muted-foreground">•</span>
          <span className="font-medium">5 device integrations</span>
        </div>
      </div>

      {/* Methodology - scannable icon-prefixed points */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Our Methodology</h4>
        <div className="space-y-3 text-sm text-muted-foreground">
          {hasWearable ? (
            <>
              <div className="flex items-start gap-3">
                <span className="text-base flex-shrink-0">🔗</span>
                <p>All biometric data was collected directly from the participant&apos;s {testimonial.device} via secure API. Results compare against a 7-day baseline period before product use.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-base flex-shrink-0">💰</span>
                <p>Brands pay us the same whether results are positive or negative. They cannot edit any data.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-base flex-shrink-0">📉</span>
                <p>We show non-responders. If a product doesn&apos;t work, our data will show that.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-base flex-shrink-0">🔍</span>
                <p>Full study results are public. View all participants — not just top responders.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-base flex-shrink-0">✓</span>
                <p>Brands can choose which stories to feature but cannot alter the underlying data.</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <span className="text-base flex-shrink-0">📋</span>
                <p>Participants complete a validated assessment at baseline and endpoint. Questions are scientifically designed to measure outcomes reliably.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-base flex-shrink-0">📅</span>
                <p>Weekly check-ins track engagement and progress. We verify consistent participation before results count.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-base flex-shrink-0">💰</span>
                <p>Brands pay us the same whether results are positive or negative. Participants receive the same rebate regardless of their feedback.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-base flex-shrink-0">📉</span>
                <p>We show non-responders. If a product doesn&apos;t work, our data will show that.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-base flex-shrink-0">✓</span>
                <p>Brands can choose which stories to feature but cannot alter the assessment scores or responses.</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Raw data toggle */}
      <div>
        <button
          onClick={() => setShowRawData(!showRawData)}
          className="flex items-center gap-2 text-sm font-medium text-[#00D1C1] hover:underline"
        >
          {showRawData ? "Hide" : "View"} verification data sample
          {showRawData ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showRawData && (
          <div className="mt-3 bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-gray-300">
{hasWearable
  ? `{
  "verification_id": "${testimonial.verificationId}",
  "participant_id": "anon_${testimonial.id}",
  "device": "${testimonial.device}",
  "data_points": ${formattedDataPoints.replace(/,/g, "")},
  "verified_at": "2024-12-05T18:32:00Z",
  "verification_hash": "sha256:7f83b1657..."
}`
  : `{
  "verification_id": "${testimonial.verificationId}",
  "participant_id": "anon_${testimonial.id}",
  "assessment_type": "validated_questionnaire",
  "check_ins_completed": ${studyDuration / 7},
  "engagement_verified": true,
  "verified_at": "2024-12-05T18:32:00Z",
  "verification_hash": "sha256:7f83b1657..."
}`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

interface VerificationPageProps {
  testimonial: MockTestimonial;
  studyTitle: string;
  productName: string;
  studyDuration: number;
  studyId: string;
  story?: ParticipantStory;
  hasWearable?: boolean; // Optional - determines wearable vs assessment-only display
}

export function VerificationPage({
  testimonial,
  studyTitle,
  productName,
  studyDuration,
  studyId,
  story,
  hasWearable: hasWearableProp,
}: VerificationPageProps) {
  const [showHowWeVerify, setShowHowWeVerify] = useState(false);

  // Determine if this is a wearable-based verification
  // Default: check if story has meaningful wearable metrics, or if testimonial has device
  const hasWearable = hasWearableProp ?? (
    testimonial.device !== undefined &&
    testimonial.device !== "" &&
    testimonial.device !== "None"
  );

  // Calculate data points
  const dataPointsCollected = hasWearable ? studyDuration * 24 * 30 : 0;
  const formattedDataPoints = dataPointsCollected.toLocaleString();

  // Build detailed metrics
  const detailedMetrics = story ? [
    story.wearableMetrics.deepSleepChange && {
      label: "Deep Sleep",
      before: `${story.wearableMetrics.deepSleepChange.before}min`,
      after: `${story.wearableMetrics.deepSleepChange.after}min`,
      change: `${story.wearableMetrics.deepSleepChange.changePercent > 0 ? "+" : ""}${story.wearableMetrics.deepSleepChange.changePercent}%`,
      icon: Moon,
    },
    {
      label: "Total Sleep",
      before: `${(story.wearableMetrics.sleepChange.before / 60).toFixed(1)}h`,
      after: `${(story.wearableMetrics.sleepChange.after / 60).toFixed(1)}h`,
      change: `${story.wearableMetrics.sleepChange.changePercent > 0 ? "+" : ""}${story.wearableMetrics.sleepChange.changePercent}%`,
      icon: Star,
    },
    story.wearableMetrics.hrvChange && {
      label: "HRV",
      before: `${story.wearableMetrics.hrvChange.before}ms`,
      after: `${story.wearableMetrics.hrvChange.after}ms`,
      change: `${story.wearableMetrics.hrvChange.changePercent > 0 ? "+" : ""}${story.wearableMetrics.hrvChange.changePercent}%`,
      icon: Heart,
    },
    story.wearableMetrics.restingHrChange && {
      label: "Resting HR",
      before: `${story.wearableMetrics.restingHrChange.before}bpm`,
      after: `${story.wearableMetrics.restingHrChange.after}bpm`,
      change: `${story.wearableMetrics.restingHrChange.changePercent}%`,
      icon: Activity,
    },
  ].filter(Boolean) as { label: string; before: string; after: string; change: string; icon: React.ElementType }[]
  : [
    { label: "Deep Sleep", before: "1h 12m", after: "1h 29m", change: "+23%", icon: Moon },
    { label: "Sleep Score", before: "72", after: "83", change: "+15%", icon: Star },
    { label: "HRV", before: "42ms", after: "51ms", change: "+21%", icon: Heart },
    { label: "Resting HR", before: "68 bpm", after: "62 bpm", change: "-9%", icon: Activity },
  ];

  // Build timeline
  const timeline = [
    { date: "Nov 1, 2024", title: "Study Enrollment", description: "Participant enrolled and connected wearable device", icon: Smartphone },
    { date: "Nov 1-7, 2024", title: "Baseline Period", description: "7 days of baseline data collected before product use", icon: Activity },
    { date: "Nov 8, 2024", title: "Product Started", description: `Began using ${productName}`, icon: Zap },
    { date: "Nov 8 - Dec 5, 2024", title: "Study Period", description: `${studyDuration} days of tracked product usage`, icon: Calendar },
    { date: "Dec 5, 2024", title: "Study Completed", description: "Final data collected and verified", icon: BadgeCheck },
  ];

  void studyTitle; // Available for future use
  void studyId; // Available for future use

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#00D1C1]">Reputable Health</p>
                <p className="text-xs text-muted-foreground">Third-Party Verification</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* ===== SECTION 1: Credibility Hook ===== */}
        {/* Quick establishment of "this is different" - answers "who is this?" */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <ReputableSeal size="md" />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold">
              This testimonial has been independently verified.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {hasWearable ? (
                <>
                  Unlike reviews that can be faked or paid for, this is a{" "}
                  <span className="font-semibold text-foreground">real person</span> who participated for{" "}
                  <span className="font-semibold text-foreground">{studyDuration} days</span>{" "}
                  with no incentive to exaggerate.
                </>
              ) : (
                <>
                  This is a{" "}
                  <span className="font-semibold text-foreground">real person</span> who completed a{" "}
                  <span className="font-semibold text-foreground">{studyDuration}-day structured assessment</span>{" "}
                  with no incentive to exaggerate. Same rebate given regardless of results.
                </>
              )}
            </p>
          </div>

          {/* Learn more link - for those who want to dig into HOW we verify */}
          <button
            onClick={() => setShowHowWeVerify(!showHowWeVerify)}
            className="inline-flex items-center gap-2 text-sm text-[#00D1C1] hover:underline font-medium"
          >
            <Info className="h-4 w-4" />
            {showHowWeVerify ? "Hide verification details" : "Learn how we verify"}
            {showHowWeVerify ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {/* Expandable "How We Verify" section */}
          {showHowWeVerify && (
            <Card className="text-left mt-4">
              <CardContent className="p-6">
                <HowWeVerifySection
                  testimonial={testimonial}
                  formattedDataPoints={formattedDataPoints}
                  studyDuration={studyDuration}
                  hasWearable={hasWearable}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* ===== SECTION 1.5: Study Overview - Aggregate Stats ===== */}
        {/* This is the key to transparency - even if brand picks which stories to feature,
            they can't hide the aggregate truth */}
        <Card className="border-[#00D1C1]/20 bg-gradient-to-r from-[#00D1C1]/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#00D1C1]/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-[#00D1C1]" />
                </div>
                <div>
                  <p className="font-semibold">Study Results</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">47 people</span>{" "}
                    {hasWearable
                      ? "tried this product while wearing their device"
                      : "completed the structured assessment protocol"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-green-600">38</span>
                  </div>
                  <p className="text-xs text-muted-foreground">showed improvement</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-muted-foreground">9</span>
                  </div>
                  <p className="text-xs text-muted-foreground">showed no improvement</p>
                </div>
              </div>
            </div>

            {/* Progress bar visualization */}
            <div className="mt-4">
              <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                <div className="h-full bg-green-500" style={{ width: '81%' }} />
                <div className="h-full bg-gray-300" style={{ width: '19%' }} />
              </div>
            </div>

            {/* Key trust message - emphasize the Trust Stack instead of just wearables */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-center text-muted-foreground">
                <span className="font-medium text-foreground">Real people. Real participation. No incentive to lie.</span>{" "}
                Every participant receives the same rebate regardless of their feedback.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <a
                href={`/verify/${testimonial.verificationId}/results`}
                className="text-sm text-[#00D1C1] hover:underline font-medium flex items-center gap-1"
              >
                View all verified results
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* ===== SECTION 2: The Participant - THE HERO ===== */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {testimonial.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold">{testimonial.participant}</h2>
                  <InlineVerifiedBadge />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {testimonial.age} years old
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {testimonial.location}
                  </span>
                  {hasWearable && (
                    <span className="flex items-center gap-1">
                      <Watch className="h-4 w-4" />
                      {testimonial.device}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.floor(testimonial.overallRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-semibold">{testimonial.overallRating}</span>
                </div>
                <p className="text-sm bg-muted/50 p-4 rounded-lg italic">
                  &ldquo;{testimonial.story}&rdquo;
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== SECTION 2.5: The Villain Variable - THE PROBLEM BEING SOLVED ===== */}
        {story && (
          <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-amber-900">Problem Being Solved</h3>
                    <InlineVerifiedBadge label="Tracked" />
                  </div>
                  <p className="text-2xl font-bold text-amber-800 capitalize mb-3">
                    {story.journey.villainVariable}
                  </p>

                  {/* Progress visualization */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-amber-700 font-medium">Progress over {story.journey.durationDays} days</span>
                      {story.journey.villainRatings.length > 0 && (
                        <span className={`font-semibold ${
                          story.journey.villainRatings[story.journey.villainRatings.length - 1].rating >= 4
                            ? "text-green-600"
                            : story.journey.villainRatings[story.journey.villainRatings.length - 1].rating >= 3
                            ? "text-yellow-600"
                            : "text-red-500"
                        }`}>
                          {story.journey.villainRatings[story.journey.villainRatings.length - 1].rating >= 4
                            ? "Significantly Improved"
                            : story.journey.villainRatings[story.journey.villainRatings.length - 1].rating >= 3
                            ? "Some Improvement"
                            : "No Improvement"}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {story.journey.villainRatings.map((rating, idx) => (
                        <div
                          key={idx}
                          className={`h-3 flex-1 rounded-full ${
                            rating.rating >= 4 ? "bg-green-500" :
                            rating.rating === 3 ? "bg-yellow-400" :
                            "bg-red-400"
                          }`}
                          title={`Day ${rating.day}: ${rating.note || ''}`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-amber-600">
                      <span>Day 1</span>
                      <span>Day {story.journey.durationDays}</span>
                    </div>
                  </div>

                  {/* First and last rating comparison */}
                  {story.journey.villainRatings.length >= 2 && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-xs text-red-600 font-medium">Day {story.journey.villainRatings[0].day}</p>
                        <p className="text-sm text-red-800 italic mt-1">
                          &ldquo;{story.journey.villainRatings[0].note}&rdquo;
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-green-600 font-medium">Day {story.journey.villainRatings[story.journey.villainRatings.length - 1].day}</p>
                        <p className="text-sm text-green-800 italic mt-1">
                          &ldquo;{story.journey.villainRatings[story.journey.villainRatings.length - 1].note}&rdquo;
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ===== SECTION 3: Participant Context ===== */}
        {story && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-[#00D1C1]" />
                Participant Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Life Stage</p>
                  <p className="font-medium">{story.profile.lifeStage}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Duration Dealing with Issue</p>
                  <p className="font-medium">{story.baseline.villainDuration}</p>
                </div>
              </div>

              {story.baseline.triedOther && story.baseline.triedOther !== "No" && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Previously tried:</strong> {story.baseline.triedOther}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Quote className="h-4 w-4 text-[#00D1C1]" />
                  <span>Why They Joined the Study</span>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 border-l-4 border-purple-400">
                  <p className="text-sm italic text-purple-900">
                    &ldquo;{story.baseline.motivation}&rdquo;
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Target className="h-4 w-4 text-[#00D1C1]" />
                  <span>What They Hoped to Achieve</span>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                  <p className="text-sm italic text-blue-900">
                    &ldquo;{story.baseline.hopedResults}&rdquo;
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ===== SECTION 4: Self-Reported Progress ===== */}
        {story && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#00D1C1]" />
                Self-Reported Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VillainJourneyProgress
                ratings={story.journey.villainRatings}
                villainVariable={story.journey.villainVariable}
              />
            </CardContent>
          </Card>
        )}

        {/* ===== SECTION 5: Key Moments ===== */}
        {story && story.journey.keyQuotes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#00D1C1]" />
                Key Moments During the Study
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {story.journey.keyQuotes.map((kq, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="px-3 py-1 rounded-full bg-[#00D1C1]/10 text-[#00D1C1] text-sm font-medium">
                        Day {kq.day}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm italic mb-1">&ldquo;{kq.quote}&rdquo;</p>
                      <p className="text-xs text-muted-foreground">{kq.context}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ===== SECTION 6: Study Details ===== */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Study Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-[#00D1C1]">{studyDuration}</p>
                <p className="text-sm text-muted-foreground">Days in Study</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-[#00D1C1]">100%</p>
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-[#00D1C1]">
                  {hasWearable ? studyDuration * 24 : Math.floor(studyDuration / 7) + 2}
                </p>
                <p className="text-sm text-muted-foreground">
                  {hasWearable ? "Hours of Data" : "Check-ins Completed"}
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-[#00D1C1]/5 rounded-lg border border-[#00D1C1]/20">
              <p className="text-sm">
                <strong>Product:</strong> {productName}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ===== SECTION 7: Verified Results (Tier-Aware) ===== */}
        {(() => {
          const tier = story?.tier || 1;

          // Tier 1: Wearables PRIMARY
          if (tier === 1) {
            return (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-[#00D1C1]" />
                      Verified Results
                      <InlineVerifiedBadge label="Device Data" />
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                        PRIMARY
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Wearable data directly measures the outcome. No surveys needed - the device tells the story.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {detailedMetrics.map((metric) => (
                        <MetricCard key={metric.label} {...metric} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Testimonial Responses for Tier 1 */}
                {story?.testimonialResponses && story.testimonialResponses.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Quote className="h-5 w-5 text-purple-600" />
                        In Their Own Words
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TestimonialResponsesSection responses={story.testimonialResponses} />
                    </CardContent>
                  </Card>
                )}
              </>
            );
          }

          // Tier 2: Co-Primary (Wearables + Assessment)
          if (tier === 2 && story?.assessmentResult) {
            return (
              <>
                {/* Assessment Result */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      Self-Reported Assessment
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                        CO-PRIMARY
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AssessmentResultCard
                      assessmentName={story.assessmentResult.assessmentName}
                      baselineScore={story.assessmentResult.baseline.compositeScore}
                      endpointScore={story.assessmentResult.endpoint.compositeScore}
                      changePercent={story.assessmentResult.change.compositePercent}
                      headline={story.assessmentResult.headline}
                      isPrimary={false}
                    />
                  </CardContent>
                </Card>

                {/* Wearable Data */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Watch className="h-5 w-5 text-[#00D1C1]" />
                      Objective Wearable Data
                      <InlineVerifiedBadge label="Device Data" />
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                        CO-PRIMARY
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Physiological stress markers corroborate the self-reported improvement.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {detailedMetrics.map((metric) => (
                        <MetricCard key={metric.label} {...metric} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Combined insight for Tier 2 */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-[#00D1C1]/10 rounded-lg border border-purple-200">
                  <p className="text-sm text-center">
                    <strong className="text-purple-700">Both metrics improved:</strong>{" "}
                    Objective wearable data shows physiological improvement{" "}
                    <span className="font-semibold text-[#00D1C1]">AND</span>{" "}
                    participant reported feeling better.
                  </p>
                </div>
              </>
            );
          }

          // Tier 3-4: Assessment PRIMARY
          if ((tier === 3 || tier === 4) && story?.assessmentResult) {
            return (
              <>
                {/* Assessment Result as HERO */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      Verified Assessment Results
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                        PRIMARY
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AssessmentResultCard
                      assessmentName={story.assessmentResult.assessmentName}
                      baselineScore={story.assessmentResult.baseline.compositeScore}
                      endpointScore={story.assessmentResult.endpoint.compositeScore}
                      changePercent={story.assessmentResult.change.compositePercent}
                      headline={story.assessmentResult.headline}
                      isPrimary={true}
                    />
                  </CardContent>
                </Card>

                {/* Photo Documentation for Tier 4 with photos */}
                {tier === 4 && story?.photoDocumentation && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="h-5 w-5 text-orange-600" />
                        Photo Documentation
                        <InlineVerifiedBadge label="Verified" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {story.photoDocumentation.beforePhoto && (
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">Before</p>
                            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                              <span className="text-muted-foreground text-sm">Photo Available</span>
                            </div>
                          </div>
                        )}
                        {story.photoDocumentation.afterPhoto && (
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">After</p>
                            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                              <span className="text-muted-foreground text-sm">Photo Available</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Wearable Data as SECONDARY/Supporting - only show if has wearable */}
                {hasWearable && (
                  <Card className="border-dashed">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
                        <Watch className="h-5 w-5" />
                        Supporting Evidence: Wearable Data
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                          {tier === 4 ? "PROOF OF ENGAGEMENT" : "SECONDARY"}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {tier === 4
                          ? "Wearable data confirms participant engagement throughout the study."
                          : "Wearable data provides supporting context for the assessment results."}
                      </p>
                      <div className="grid grid-cols-2 gap-4 opacity-80">
                        {detailedMetrics.map((metric) => (
                          <MetricCard key={metric.label} {...metric} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Engagement verification for non-wearable participants */}
                {!hasWearable && (
                  <Card className="border-dashed">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-5 w-5" />
                        Engagement Verification
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                          VERIFIED
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Participant engagement verified through consistent check-in completion.
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <p className="text-xl font-bold text-[#00D1C1]">{Math.floor(studyDuration / 7) + 2}</p>
                          <p className="text-xs text-muted-foreground">Check-ins Completed</p>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <p className="text-xl font-bold text-[#00D1C1]">100%</p>
                          <p className="text-xs text-muted-foreground">Response Rate</p>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <p className="text-xl font-bold text-[#00D1C1]">{studyDuration}</p>
                          <p className="text-xs text-muted-foreground">Days Active</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            );
          }

          // Fallback: Original layout
          return (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#00D1C1]" />
                  Verified Results
                  <InlineVerifiedBadge label="Device Data" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {detailedMetrics.map((metric) => (
                    <MetricCard key={metric.label} {...metric} />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* ===== SECTION 8: Reported Benefits ===== */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reported Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {testimonial.benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm"
                >
                  <Check className="h-3.5 w-3.5" />
                  {benefit}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ===== SECTION 9: Participant Journey Timeline ===== */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#00D1C1]" />
              Participant Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {timeline.map((event, index) => (
                <TimelineEvent
                  key={event.title}
                  {...event}
                  isLast={index === timeline.length - 1}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ===== SECTION 10: QR Code ===== */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 bg-white rounded-lg border p-2 flex items-center justify-center flex-shrink-0">
                <QRCodeSVG
                  value={`https://reputable.health/verify/${testimonial.verificationId}`}
                  size={80}
                  level="M"
                  fgColor="#00D1C1"
                  bgColor="#ffffff"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Scan to Verify</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Scan this QR code with your phone to verify this result on reputable.health
                </p>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  reputable.health/verify/{testimonial.verificationId}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== Footer ===== */}
        <div className="text-center py-8 border-t">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-[#00D1C1]" />
            <span className="font-semibold text-[#00D1C1]">Reputable Health</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Independent verification for wellness products
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <BadgeCheck className="h-4 w-4 text-[#00D1C1]" />
            Verification ID: #{testimonial.verificationId}
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact verification badge for embedding in story cards
export function VerificationBadge({
  verificationId,
  onClick,
}: {
  verificationId: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00D1C1]/10 hover:bg-[#00D1C1]/20 border border-[#00D1C1]/20 transition-colors group"
    >
      <div className="relative">
        <Shield className="h-3.5 w-3.5 text-[#00D1C1]" />
        <Check className="absolute inset-0 m-auto h-1.5 w-1.5 text-[#00D1C1]" />
      </div>
      <span className="text-xs font-medium text-[#00D1C1]">
        Verified #{verificationId}
      </span>
      <span className="text-xs text-[#00D1C1]/70 hidden group-hover:inline">• Click to see proof</span>
      <ExternalLink className="h-3 w-3 text-[#00D1C1] opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
