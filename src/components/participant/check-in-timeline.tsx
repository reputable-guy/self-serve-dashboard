"use client";

/**
 * CheckInTimeline - Display participant check-in history with responses
 * Extracted from participant-detail-panel.tsx for reusability
 */

import {
  CheckCircle2,
  XCircle,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import type { ParticipantDetail } from "@/lib/mock-data";

interface CheckInTimelineProps {
  checkIns: ParticipantDetail["checkIns"];
}

export function CheckInTimeline({ checkIns }: CheckInTimelineProps) {
  // Show last 10 check-ins
  const recentCheckIns = checkIns.slice(-10).reverse();

  return (
    <div className="space-y-3">
      {recentCheckIns.map((checkIn) => (
        <div
          key={checkIn.day}
          className={`p-3 rounded-lg border ${
            checkIn.completed
              ? "bg-green-500/5 border-green-500/20"
              : "bg-red-500/5 border-red-500/20"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {checkIn.completed ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="font-medium text-sm">Day {checkIn.day}</span>
              <span className="text-xs text-muted-foreground">{checkIn.date}</span>
            </div>
            {checkIn.completed && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
                Completed
              </span>
            )}
            {!checkIn.completed && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-600">
                Missed
              </span>
            )}
          </div>

          {checkIn.completed && (
            <div className="space-y-2 mt-3">
              {/* Villain Response */}
              {checkIn.villainResponse && (
                <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">{checkIn.villainResponse.question}</p>
                      <p className="text-sm font-medium text-purple-600">{checkIn.villainResponse.answer}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Responses */}
              {checkIn.customResponses && checkIn.customResponses.length > 0 && (
                <div className="space-y-2">
                  {checkIn.customResponses.map((response, idx) => (
                    <div key={idx} className="text-sm">
                      {response.questionType === "likert_scale" ? (
                        <LikertScaleResponse response={response} />
                      ) : (
                        <div className="flex items-start gap-2">
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <span className="text-muted-foreground">{response.question}</span>
                            <span className="font-medium ml-2">{response.answer}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Sub-component for Likert scale responses
interface LikertScaleResponseProps {
  response: {
    question: string;
    likertValue?: number;
    likertMin?: number;
    likertMax?: number;
    likertMinLabel?: string;
    likertMaxLabel?: string;
  };
}

function LikertScaleResponse({ response }: LikertScaleResponseProps) {
  return (
    <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
      <p className="text-xs text-muted-foreground mb-2">{response.question}</p>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{response.likertMinLabel}</span>
          <span>{response.likertMaxLabel}</span>
        </div>
        <div className="flex gap-0.5">
          {Array.from(
            { length: (response.likertMax || 10) - (response.likertMin || 1) + 1 },
            (_, i) => (response.likertMin || 1) + i
          ).map((num) => (
            <div
              key={num}
              className={`flex-1 h-6 rounded text-xs flex items-center justify-center font-medium ${
                num === response.likertValue
                  ? "bg-blue-500 text-white"
                  : num < (response.likertValue || 0)
                  ? "bg-blue-500/30 text-blue-600"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {num}
            </div>
          ))}
        </div>
        <p className="text-center text-sm font-semibold text-blue-600">
          {response.likertValue} / {response.likertMax || 10}
        </p>
      </div>
    </div>
  );
}
