"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  ArrowLeft,
  TrendingUp,
  Minus,
  Watch,
  Filter,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

// Mock data for all study participants
const ALL_PARTICIPANTS = [
  // Improved participants (38)
  { id: "2025-01", name: "Sarah M.", initials: "SM", age: 34, device: "Oura Ring", outcome: "improved", mainMetric: "Deep Sleep +23%", rating: 4.8 },
  { id: "2025-02", name: "Michael R.", initials: "MR", age: 42, device: "Apple Watch", outcome: "improved", mainMetric: "Sleep Score +18%", rating: 4.5 },
  { id: "2025-03", name: "Jennifer L.", initials: "JL", age: 29, device: "Whoop", outcome: "improved", mainMetric: "HRV +15%", rating: 4.7 },
  { id: "2025-04", name: "David K.", initials: "DK", age: 51, device: "Oura Ring", outcome: "improved", mainMetric: "Deep Sleep +31%", rating: 5.0 },
  { id: "2025-05", name: "Emily T.", initials: "ET", age: 38, device: "Fitbit", outcome: "improved", mainMetric: "Sleep Duration +12%", rating: 4.3 },
  { id: "2025-06", name: "Robert P.", initials: "RP", age: 45, device: "Apple Watch", outcome: "improved", mainMetric: "Resting HR -8%", rating: 4.6 },
  { id: "2025-07", name: "Amanda C.", initials: "AC", age: 33, device: "Oura Ring", outcome: "improved", mainMetric: "Deep Sleep +19%", rating: 4.4 },
  { id: "2025-08", name: "James W.", initials: "JW", age: 47, device: "Whoop", outcome: "improved", mainMetric: "Recovery +22%", rating: 4.9 },
  { id: "2025-09", name: "Lisa H.", initials: "LH", age: 36, device: "Apple Watch", outcome: "improved", mainMetric: "Sleep Score +14%", rating: 4.2 },
  { id: "2025-10", name: "Christopher B.", initials: "CB", age: 41, device: "Oura Ring", outcome: "improved", mainMetric: "HRV +28%", rating: 4.8 },
  { id: "2025-11", name: "Michelle D.", initials: "MD", age: 28, device: "Fitbit", outcome: "improved", mainMetric: "Deep Sleep +16%", rating: 4.1 },
  { id: "2025-12", name: "Daniel F.", initials: "DF", age: 53, device: "Apple Watch", outcome: "improved", mainMetric: "Sleep Duration +9%", rating: 4.0 },
  { id: "2025-13", name: "Jessica N.", initials: "JN", age: 31, device: "Whoop", outcome: "improved", mainMetric: "Strain Balance +17%", rating: 4.6 },
  { id: "2025-14", name: "Matthew G.", initials: "MG", age: 39, device: "Oura Ring", outcome: "improved", mainMetric: "Deep Sleep +25%", rating: 4.7 },
  { id: "2025-15", name: "Ashley V.", initials: "AV", age: 44, device: "Apple Watch", outcome: "improved", mainMetric: "HRV +11%", rating: 4.3 },
  { id: "2025-16", name: "Andrew S.", initials: "AS", age: 37, device: "Oura Ring", outcome: "improved", mainMetric: "Sleep Score +20%", rating: 4.9 },
  { id: "2025-17", name: "Stephanie Y.", initials: "SY", age: 32, device: "Whoop", outcome: "improved", mainMetric: "Recovery +19%", rating: 4.5 },
  { id: "2025-18", name: "Joshua Z.", initials: "JZ", age: 48, device: "Fitbit", outcome: "improved", mainMetric: "Deep Sleep +14%", rating: 4.2 },
  { id: "2025-19", name: "Nicole O.", initials: "NO", age: 35, device: "Apple Watch", outcome: "improved", mainMetric: "Resting HR -6%", rating: 4.4 },
  { id: "2025-20", name: "Ryan I.", initials: "RI", age: 40, device: "Oura Ring", outcome: "improved", mainMetric: "HRV +24%", rating: 4.8 },
  { id: "2025-21", name: "Heather U.", initials: "HU", age: 46, device: "Whoop", outcome: "improved", mainMetric: "Sleep Score +16%", rating: 4.3 },
  { id: "2025-22", name: "Kevin E.", initials: "KE", age: 30, device: "Oura Ring", outcome: "improved", mainMetric: "Deep Sleep +21%", rating: 4.6 },
  { id: "2025-23", name: "Megan A.", initials: "MA", age: 43, device: "Apple Watch", outcome: "improved", mainMetric: "Sleep Duration +11%", rating: 4.1 },
  { id: "2025-24", name: "Brian Q.", initials: "BQ", age: 52, device: "Fitbit", outcome: "improved", mainMetric: "HRV +13%", rating: 4.0 },
  { id: "2025-25", name: "Rachel X.", initials: "RX", age: 27, device: "Oura Ring", outcome: "improved", mainMetric: "Deep Sleep +29%", rating: 5.0 },
  { id: "2025-26", name: "Timothy J.", initials: "TJ", age: 38, device: "Whoop", outcome: "improved", mainMetric: "Recovery +15%", rating: 4.4 },
  { id: "2025-27", name: "Lauren K.", initials: "LK", age: 34, device: "Apple Watch", outcome: "improved", mainMetric: "Sleep Score +12%", rating: 4.2 },
  { id: "2025-28", name: "Steven L.", initials: "SL", age: 49, device: "Oura Ring", outcome: "improved", mainMetric: "Resting HR -7%", rating: 4.5 },
  { id: "2025-29", name: "Kimberly M.", initials: "KM", age: 36, device: "Fitbit", outcome: "improved", mainMetric: "Deep Sleep +17%", rating: 4.3 },
  { id: "2025-30", name: "Jason N.", initials: "JN2", age: 41, device: "Whoop", outcome: "improved", mainMetric: "HRV +20%", rating: 4.7 },
  { id: "2025-31", name: "Angela P.", initials: "AP", age: 33, device: "Apple Watch", outcome: "improved", mainMetric: "Sleep Duration +8%", rating: 4.0 },
  { id: "2025-32", name: "Eric R.", initials: "ER", age: 45, device: "Oura Ring", outcome: "improved", mainMetric: "Deep Sleep +22%", rating: 4.6 },
  { id: "2025-33", name: "Christina S.", initials: "CS", age: 29, device: "Oura Ring", outcome: "improved", mainMetric: "Sleep Score +19%", rating: 4.8 },
  { id: "2025-34", name: "Mark T.", initials: "MT", age: 50, device: "Apple Watch", outcome: "improved", mainMetric: "HRV +10%", rating: 4.1 },
  { id: "2025-35", name: "Rebecca U.", initials: "RU", age: 37, device: "Whoop", outcome: "improved", mainMetric: "Recovery +18%", rating: 4.5 },
  { id: "2025-36", name: "Scott V.", initials: "SV", age: 44, device: "Fitbit", outcome: "improved", mainMetric: "Deep Sleep +15%", rating: 4.2 },
  { id: "2025-37", name: "Laura W.", initials: "LW", age: 31, device: "Oura Ring", outcome: "improved", mainMetric: "Resting HR -9%", rating: 4.7 },
  { id: "2025-38", name: "Gregory X.", initials: "GX", age: 42, device: "Apple Watch", outcome: "improved", mainMetric: "Sleep Score +13%", rating: 4.3 },

  // No improvement participants (9)
  { id: "2025-39", name: "Patricia Y.", initials: "PY", age: 55, device: "Oura Ring", outcome: "no_change", mainMetric: "No significant change", rating: 3.0 },
  { id: "2025-40", name: "Thomas Z.", initials: "TZ", age: 26, device: "Apple Watch", outcome: "no_change", mainMetric: "Sleep Score +2%", rating: 2.8 },
  { id: "2025-41", name: "Sandra A.", initials: "SA", age: 48, device: "Whoop", outcome: "no_change", mainMetric: "HRV unchanged", rating: 3.2 },
  { id: "2025-42", name: "Charles B.", initials: "CB2", age: 39, device: "Fitbit", outcome: "no_change", mainMetric: "Deep Sleep +1%", rating: 2.5 },
  { id: "2025-43", name: "Dorothy C.", initials: "DC", age: 61, device: "Oura Ring", outcome: "no_change", mainMetric: "No significant change", rating: 3.1 },
  { id: "2025-44", name: "Paul D.", initials: "PD", age: 35, device: "Apple Watch", outcome: "no_change", mainMetric: "Sleep Duration -1%", rating: 2.7 },
  { id: "2025-45", name: "Nancy E.", initials: "NE", age: 43, device: "Whoop", outcome: "no_change", mainMetric: "Recovery unchanged", rating: 3.0 },
  { id: "2025-46", name: "Donald F.", initials: "DF2", age: 57, device: "Oura Ring", outcome: "no_change", mainMetric: "HRV +3%", rating: 2.9 },
  { id: "2025-47", name: "Betty G.", initials: "BG", age: 40, device: "Fitbit", outcome: "no_change", mainMetric: "No significant change", rating: 3.3 },
];

type FilterType = "all" | "improved" | "no_change";

export default function AllResultsPage() {
  const params = useParams();
  const verificationId = params.id as string;
  const [filter, setFilter] = useState<FilterType>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredParticipants = ALL_PARTICIPANTS.filter((p) => {
    if (filter === "all") return true;
    return p.outcome === filter;
  });

  const improvedCount = ALL_PARTICIPANTS.filter((p) => p.outcome === "improved").length;
  const noChangeCount = ALL_PARTICIPANTS.filter((p) => p.outcome === "no_change").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/verify/${verificationId}`}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00D1C1] to-[#00A89D] flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-[#00D1C1]">Reputable Health</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">All Verified Results</h1>
          <p className="text-muted-foreground">
            Complete transparency: every participant from this study, regardless of outcome.
          </p>
        </div>

        {/* Aggregate Stats */}
        <Card className="border-[#00D1C1]/20 bg-gradient-to-r from-[#00D1C1]/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#00D1C1]/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-[#00D1C1]" />
                </div>
                <div>
                  <p className="font-semibold">Study: Better Sleep Study</p>
                  <p className="text-sm text-muted-foreground">
                    Product: SleepWell Premium • 28 days
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <span className="text-2xl font-bold text-green-600">{improvedCount}</span>
                  <p className="text-xs text-muted-foreground">showed improvement</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <span className="text-2xl font-bold text-muted-foreground">{noChangeCount}</span>
                  <p className="text-xs text-muted-foreground">showed no improvement</p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(improvedCount / ALL_PARTICIPANTS.length) * 100}%` }}
                />
                <div
                  className="h-full bg-gray-300"
                  style={{ width: `${(noChangeCount / ALL_PARTICIPANTS.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-center text-muted-foreground">
                <span className="font-medium text-foreground">Real people. Real participation. No incentive to lie.</span>{" "}
                The brand cannot hide any of these results.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Filter */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredParticipants.length} of {ALL_PARTICIPANTS.length} participants
          </p>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {filter === "all" ? "All Results" : filter === "improved" ? "Improved" : "No Change"}
              <ChevronDown className="h-4 w-4" />
            </Button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-1 w-40 bg-white border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => { setFilter("all"); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-muted ${filter === "all" ? "bg-muted" : ""}`}
                >
                  All Results ({ALL_PARTICIPANTS.length})
                </button>
                <button
                  onClick={() => { setFilter("improved"); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-muted ${filter === "improved" ? "bg-muted" : ""}`}
                >
                  Improved ({improvedCount})
                </button>
                <button
                  onClick={() => { setFilter("no_change"); setShowFilterDropdown(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-muted ${filter === "no_change" ? "bg-muted" : ""}`}
                >
                  No Change ({noChangeCount})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Participants List */}
        <div className="space-y-3">
          {filteredParticipants.map((participant) => (
            <Link
              key={participant.id}
              href={`/verify/${participant.id}`}
              className="block"
            >
              <Card className="hover:border-[#00D1C1]/50 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                      participant.outcome === "improved"
                        ? "bg-gradient-to-br from-green-500 to-green-600"
                        : "bg-gradient-to-br from-gray-400 to-gray-500"
                    }`}>
                      {participant.initials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{participant.name}</p>
                        <span className="inline-flex items-center gap-1 text-xs text-[#00D1C1] bg-[#00D1C1]/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{participant.age} years old</span>
                        <span className="flex items-center gap-1">
                          <Watch className="h-3 w-3" />
                          {participant.device}
                        </span>
                      </div>
                    </div>

                    {/* Outcome */}
                    <div className="text-right flex-shrink-0">
                      {participant.outcome === "improved" ? (
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-600">{participant.mainMetric}</p>
                            <div className="flex items-center gap-1 justify-end">
                              <TrendingUp className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-green-600">Improved</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-right">
                          <p className="text-sm font-medium text-muted-foreground">{participant.mainMetric}</p>
                          <div className="flex items-center gap-1 justify-end">
                            <Minus className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-muted-foreground">No change</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Arrow */}
                    <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Trust footer */}
        <div className="text-center py-8 border-t">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-[#00D1C1]" />
            <span className="font-semibold text-[#00D1C1]">Reputable Health</span>
          </div>
          <p className="text-sm text-muted-foreground">
            All results shown. Nothing hidden. That&apos;s radical transparency.
          </p>
        </div>
      </div>
    </div>
  );
}
