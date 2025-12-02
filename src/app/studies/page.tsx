"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FlaskConical, Clock, Watch, Users } from "lucide-react";
import { useStudies, Study } from "@/lib/studies-store";

const statusStyles: Record<Study["status"], { bg: string; text: string; label: string }> = {
  draft: { bg: "bg-gray-500/20", text: "text-gray-400", label: "Draft" },
  recruiting: { bg: "bg-[#00D1C1]/20", text: "text-[#00D1C1]", label: "Recruiting" },
  "filling-fast": { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "⚡ Filling Fast" },
  full: { bg: "bg-orange-500/20", text: "text-orange-400", label: "Full" },
  completed: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Completed" },
};

const deviceLabels: Record<string, string> = {
  oura: "Oura Ring",
  whoop: "Whoop",
  apple: "Apple Watch",
  garmin: "Garmin",
  fitbit: "Fitbit",
  any: "Any Device",
};

function StudyCard({ study }: { study: Study }) {
  const status = statusStyles[study.status];
  const spotsRemaining = parseInt(study.totalSpots) - study.enrolledCount;
  const device = deviceLabels[study.requiredDevice] || "Any Device";

  return (
    <Link href={`/studies/${study.id}`}>
      <Card className="overflow-hidden hover:border-[#00D1C1]/50 transition-colors cursor-pointer">
        {/* Image */}
        <div className="relative aspect-video bg-muted">
          {study.productImage ? (
            <img
              src={study.productImage}
              alt={study.productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FlaskConical className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>
          {/* Spots */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white">
              <Users className="w-3 h-3" />
              {spotsRemaining} spots left
            </span>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1">{study.studyTitle || `${study.productName} Study`}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
            {study.hookQuestion || study.productDescription}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Watch className="w-3.5 h-3.5" />
              <span>{device}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{study.durationDays} Days</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <span className="text-sm text-muted-foreground">
              {study.enrolledCount}/{study.totalSpots} enrolled
            </span>
            <span className="text-sm font-medium text-[#00D1C1]">
              ${study.rebateAmount} rebate
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function StudiesPage() {
  const { studies } = useStudies();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Studies</h1>
        <Button asChild className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white">
          <Link href="/studies/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Study
          </Link>
        </Button>
      </div>

      {studies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
            <FlaskConical className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No studies yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create your first rebate study to start collecting verified testimonials from real customers using their wearable data.
          </p>
          <Button asChild className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white">
            <Link href="/studies/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Study
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => (
            <StudyCard key={study.id} study={study} />
          ))}
        </div>
      )}
    </div>
  );
}
