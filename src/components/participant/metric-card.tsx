"use client";

/**
 * MetricCard - Display a health metric with trend and sparkline
 * Extracted from participant-detail-panel.tsx for reusability
 */

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { SparklineChart } from "./sparkline-chart";

interface MetricCardProps {
  label: string;
  currentValue: number;
  baselineValue: number;
  unit: string;
  data: number[];
  color: string;
  icon: React.ElementType;
  invertTrend?: boolean;
}

export function MetricCard({
  label,
  currentValue,
  baselineValue,
  unit,
  data,
  color,
  icon: Icon,
  invertTrend = false,
}: MetricCardProps) {
  const change = ((currentValue - baselineValue) / baselineValue) * 100;
  const isPositive = invertTrend ? change < 0 : change > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md" style={{ backgroundColor: `${color}20` }}>
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
            <TrendIcon className="h-3 w-3" />
            {Math.abs(change).toFixed(0)}%
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold">{currentValue}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
          <span className="text-xs text-muted-foreground">
            (baseline: {baselineValue}{unit})
          </span>
        </div>
        <SparklineChart
          data={data}
          color={color}
          showBaseline
          baselineValue={baselineValue}
        />
      </CardContent>
    </Card>
  );
}
