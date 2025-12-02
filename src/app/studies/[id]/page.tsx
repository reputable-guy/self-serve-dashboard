"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStudies, Study } from "@/lib/studies-store";
import {
  ArrowLeft,
  Clock,
  Watch,
  Users,
  Check,
  Edit,
  Play,
  ExternalLink,
  Copy,
} from "lucide-react";

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

export default function StudyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getStudy, updateStudy } = useStudies();

  const study = getStudy(params.id as string);

  if (!study) {
    return (
      <div className="p-8">
        <div className="text-center py-24">
          <h2 className="text-xl font-semibold mb-2">Study not found</h2>
          <p className="text-muted-foreground mb-4">
            This study may have been deleted or doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/studies">Back to Studies</Link>
          </Button>
        </div>
      </div>
    );
  }

  const status = statusStyles[study.status];
  const device = deviceLabels[study.requiredDevice] || "Any Device";
  const spotsRemaining = parseInt(study.totalSpots) - study.enrolledCount;
  const rebateNum = parseFloat(study.rebateAmount || "0");
  const heartbeats = rebateNum > 0 ? Math.round(rebateNum * 100) : 0;

  // Calculate total value
  const totalValue = study.whatYouGet.reduce((sum, item) => {
    const match = item.value.match(/\$?(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  const handleLaunchStudy = () => {
    updateStudy(study.id, { status: "recruiting" });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/studies")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{study.studyTitle}</h1>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
              </div>
              <p className="text-muted-foreground mt-1">{study.hookQuestion}</p>
            </div>
            <div className="flex items-center gap-2">
              {study.status === "draft" && (
                <Button onClick={handleLaunchStudy} className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white">
                  <Play className="h-4 w-4 mr-2" />
                  Launch Study
                </Button>
              )}
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                <strong>{study.enrolledCount}</strong>/{study.totalSpots} enrolled
              </span>
              <span className="text-muted-foreground">({spotsRemaining} spots left)</span>
            </div>
            <div className="flex items-center gap-2">
              <Watch className="h-4 w-4 text-muted-foreground" />
              <span>{device}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{study.durationDays} Days</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#00D1C1] font-semibold">${study.rebateAmount}</span>
              <span className="text-muted-foreground">rebate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="embed">Embed Code</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Study Content */}
              <div className="col-span-2 space-y-6">
                {/* Product Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Product Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6">
                      <div className="w-32 h-32 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {study.productImage ? (
                          <img
                            src={study.productImage}
                            alt={study.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{study.productName}</h3>
                        <p className="text-muted-foreground mt-1">{study.productDescription}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-lg font-semibold">${study.productPrice}</span>
                          {study.productUrl && (
                            <a
                              href={study.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#00D1C1] hover:underline flex items-center gap-1 text-sm"
                            >
                              View Product <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* What You'll Discover */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>✨</span> What Participants Will Discover
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {study.discoverItems.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Check className="w-5 h-5 text-[#00D1C1]" />
                        </div>
                        <div>
                          <p className="font-medium">{item.question}</p>
                          <p className="text-sm text-muted-foreground">{item.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Daily Routine */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>📋</span> Daily Routine
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {study.dailyRoutine.map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-[#00D1C1]/20 flex items-center justify-center">
                            <span className="text-sm font-medium text-[#00D1C1]">{index + 1}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{step.action}</p>
                          <p className="text-sm text-muted-foreground">{step.details}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* What You'll Get */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>🎁</span> What Participants Get
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {study.whatYouGet.map((item, index) => (
                        <div key={index} className="flex justify-between items-start py-2 border-b last:border-0">
                          <div>
                            <p className="font-medium">{item.item}</p>
                            <p className="text-sm text-muted-foreground">{item.note}</p>
                          </div>
                          <span className="font-semibold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <span className="font-semibold">Total Value</span>
                      <span className="text-2xl font-bold text-[#00D1C1]">${totalValue}+</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Metrics Tracked */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Metrics Being Tracked</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {study.metricsToTrack.map((metric) => (
                        <span
                          key={metric}
                          className="px-3 py-1 bg-muted rounded-full text-sm"
                        >
                          {metric.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Reward Summary */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-[#00D1C1]/10 to-[#00D1C1]/5 border-[#00D1C1]/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Reward Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Rebate Amount</p>
                      <p className="text-3xl font-bold text-[#00D1C1]">${study.rebateAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Heartbeats Reward</p>
                      <p className="text-xl font-semibold">💗 {heartbeats.toLocaleString()}</p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">Study Duration</p>
                      <p className="text-lg font-semibold">{study.durationDays} Days</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Required Device</p>
                      <p className="text-lg font-semibold">{device}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Enrollment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-medium">
                          {study.enrolledCount}/{study.totalSpots}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00D1C1] rounded-full transition-all"
                          style={{
                            width: `${(study.enrolledCount / parseInt(study.totalSpots)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {spotsRemaining} spots remaining
                    </p>
                  </CardContent>
                </Card>

                {study.status !== "draft" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Share Study</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Share this link with potential participants
                      </p>
                      <div className="flex gap-2">
                        <code className="flex-1 px-3 py-2 bg-muted rounded text-sm truncate">
                          reputable.health/s/{study.id}
                        </code>
                        <Button variant="outline" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="participants">
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No participants yet</h3>
                <p className="text-muted-foreground">
                  {study.status === "draft"
                    ? "Launch your study to start accepting participants."
                    : "Participants will appear here once they join your study."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials">
            <Card>
              <CardContent className="py-12 text-center">
                <span className="text-5xl mb-4 block">💬</span>
                <h3 className="text-lg font-semibold mb-2">No testimonials yet</h3>
                <p className="text-muted-foreground">
                  Verified testimonials will appear here as participants complete the study.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="embed">
            <Card>
              <CardHeader>
                <CardTitle>Checkout Widget</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Add this widget to your checkout page to offer the rebate study to customers.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
{`<script src="https://reputable.health/widget.js"></script>
<div
  id="reputable-widget"
  data-study-id="${study.id}"
></div>`}
                  </pre>
                </div>
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
