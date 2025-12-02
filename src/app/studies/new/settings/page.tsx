"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudyPreview } from "@/components/study-preview";
import { useStudyForm } from "@/lib/study-context";

const devices = [
  { value: "oura", label: "Oura Ring" },
  { value: "whoop", label: "Whoop" },
  { value: "apple", label: "Apple Watch" },
  { value: "garmin", label: "Garmin" },
  { value: "fitbit", label: "Fitbit" },
  { value: "any", label: "Any Device" },
];

const metrics = [
  { id: "sleep-quality", label: "Sleep Quality", icon: "💤" },
  { id: "deep-sleep", label: "Deep Sleep", icon: "🌙" },
  { id: "rem-sleep", label: "REM Sleep", icon: "😴" },
  { id: "hrv", label: "HRV (Heart Rate Variability)", icon: "💓" },
  { id: "resting-heart-rate", label: "Resting Heart Rate", icon: "❤️" },
  { id: "stress", label: "Stress", icon: "😰" },
  { id: "recovery-score", label: "Recovery Score", icon: "🔋" },
  { id: "steps", label: "Steps", icon: "👣" },
  { id: "energy", label: "Energy", icon: "⚡" },
];

export default function CreateStudyStep2() {
  const router = useRouter();
  const { formData, updateField } = useStudyForm();

  const handleMetricToggle = (metricId: string) => {
    const currentMetrics = formData.metricsToTrack;
    const newMetrics = currentMetrics.includes(metricId)
      ? currentMetrics.filter((m) => m !== metricId)
      : [...currentMetrics, metricId];
    updateField("metricsToTrack", newMetrics);
  };

  const handleBack = () => {
    router.push("/studies/new");
  };

  const handleContinue = () => {
    router.push("/studies/new/preview");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="p-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-sm font-medium text-muted-foreground">
              Step 2 of 3: Study Settings
            </h1>
            <span className="text-sm text-muted-foreground">66%</span>
          </div>
          <Progress value={66} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Form Section - 60% */}
          <div className="flex-[3]">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">
                  Configure your study
                </h2>

                <div className="space-y-6">
                  {/* Rebate Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="rebateAmount">Rebate Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="rebateAmount"
                        type="text"
                        inputMode="decimal"
                        placeholder="100.00"
                        value={formData.rebateAmount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          updateField("rebateAmount", value);
                        }}
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Amount participants receive upon completing the study
                    </p>
                  </div>

                  {/* Study Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="durationDays">Study Duration</Label>
                    <div className="relative">
                      <Input
                        id="durationDays"
                        type="number"
                        min="7"
                        max="90"
                        value={formData.durationDays}
                        onChange={(e) => updateField("durationDays", e.target.value)}
                        className="pr-14"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        days
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      How long participants will track their results
                    </p>
                  </div>

                  {/* Number of Spots */}
                  <div className="space-y-2">
                    <Label htmlFor="totalSpots">Available Spots</Label>
                    <Input
                      id="totalSpots"
                      type="number"
                      min="1"
                      placeholder="50"
                      value={formData.totalSpots}
                      onChange={(e) => updateField("totalSpots", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum participants for this study
                    </p>
                  </div>

                  {/* Required Device */}
                  <div className="space-y-2">
                    <Label htmlFor="requiredDevice">Required Wearable</Label>
                    <Select
                      value={formData.requiredDevice}
                      onValueChange={(value) => updateField("requiredDevice", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select required device" />
                      </SelectTrigger>
                      <SelectContent>
                        {devices.map((device) => (
                          <SelectItem key={device.value} value={device.value}>
                            {device.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Metrics to Track */}
                  <div className="space-y-3">
                    <Label>Metrics to Track</Label>
                    <p className="text-xs text-muted-foreground -mt-1">
                      Select the health metrics relevant to your product
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {metrics.map((metric) => (
                        <label
                          key={metric.id}
                          className="flex items-center space-x-3 p-3 rounded-lg border bg-background hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <Checkbox
                            id={metric.id}
                            checked={formData.metricsToTrack.includes(metric.id)}
                            onCheckedChange={() => handleMetricToggle(metric.id)}
                          />
                          <span className="text-lg">{metric.icon}</span>
                          <span className="text-sm font-medium">{metric.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button variant="ghost" onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    onClick={handleContinue}
                    className="bg-[#00D1C1] hover:bg-[#00B8A9] text-white"
                  >
                    Continue to Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section - 40% */}
          <div className="flex-[2]">
            <div className="sticky top-8">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Live Preview
              </h3>
              <StudyPreview
                productName={formData.productName}
                productImage={formData.productImage}
                category={formData.category}
                rebateAmount={formData.rebateAmount}
                durationDays={formData.durationDays}
                totalSpots={formData.totalSpots}
                requiredDevice={formData.requiredDevice}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
