"use client";

/**
 * SyncCalendar - Display device sync history as a calendar grid
 * Extracted from participant-detail-panel.tsx for reusability
 */

import type { ParticipantDetail } from "@/lib/mock-data";

interface SyncCalendarProps {
  syncHistory: ParticipantDetail["syncHistory"];
}

export function SyncCalendar({ syncHistory }: SyncCalendarProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {syncHistory.map((day, idx) => (
        <div
          key={idx}
          className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium ${
            day.synced
              ? "bg-green-500/20 text-green-600"
              : "bg-red-500/20 text-red-600"
          }`}
          title={`${day.date}: ${day.synced ? "Synced" : "Not synced"}`}
        >
          {idx + 1}
        </div>
      ))}
    </div>
  );
}
