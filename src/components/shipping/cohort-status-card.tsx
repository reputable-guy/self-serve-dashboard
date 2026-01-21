"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  MapPin,
  Truck,
  PackageCheck,
  AlertTriangle,
  Download,
  FileEdit,
} from "lucide-react";
import type { Cohort, ParticipantShipping } from "@/lib/types";

interface CohortStatusCardProps {
  cohort: Cohort;
  participants: ParticipantShipping[];
  onDownloadCSV: () => void;
  onEnterTracking: () => void;
}

/**
 * Displays the active cohort's status with fulfillment pipeline metrics.
 * Shows enrolled → addresses → shipped → delivered pipeline.
 */
export function CohortStatusCard({
  cohort,
  participants,
  onDownloadCSV,
  onEnterTracking,
}: CohortStatusCardProps) {
  const enrolled = participants.length;
  const addressesCollected = participants.filter((p) => p.address).length;
  const shipped = participants.filter((p) => p.trackingNumber).length;
  const delivered = participants.filter(
    (p) => p.status === "delivered"
  ).length;

  const needsTracking = enrolled - shipped;
  const allAddressesCollected = addressesCollected === enrolled;
  const canShip = allAddressesCollected && shipped < enrolled;

  const getStatusLabel = (status: Cohort["status"]) => {
    switch (status) {
      case "recruiting":
        return "Recruiting";
      case "collecting_addresses":
        return "Collecting Addresses";
      case "pending_shipment":
        return "Awaiting Shipment";
      case "shipping":
        return "Shipping in Progress";
      case "complete":
        return "Complete";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: Cohort["status"]) => {
    switch (status) {
      case "recruiting":
        return "🟢";
      case "collecting_addresses":
        return "📍";
      case "pending_shipment":
        return "⏳";
      case "shipping":
        return "🚚";
      case "complete":
        return "✅";
      default:
        return "⏳";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Active Cohort: Cohort {cohort.cohortNumber}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span>{getStatusIcon(cohort.status)}</span>
              <span>{getStatusLabel(cohort.status)}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pipeline Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <MetricBox
            icon={<Users className="h-5 w-5 text-blue-500" />}
            label="Enrolled"
            value={enrolled}
            total={null}
          />
          <MetricBox
            icon={<MapPin className="h-5 w-5 text-purple-500" />}
            label="Addresses"
            value={addressesCollected}
            total={enrolled}
            complete={allAddressesCollected}
          />
          <MetricBox
            icon={<Truck className="h-5 w-5 text-amber-500" />}
            label="Shipped"
            value={shipped}
            total={enrolled}
          />
          <MetricBox
            icon={<PackageCheck className="h-5 w-5 text-green-500" />}
            label="Delivered"
            value={delivered}
            total={enrolled}
          />
        </div>

        {/* Warning Alert */}
        {canShip && needsTracking > 0 && (
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Enter all tracking codes to open next recruitment window</strong>
              <br />
              {needsTracking} participant{needsTracking !== 1 ? "s" : ""} still need
              tracking codes
            </AlertDescription>
          </Alert>
        )}

        {/* Waiting for addresses */}
        {!allAddressesCollected && (
          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <MapPin className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Waiting for {enrolled - addressesCollected} participant
              {enrolled - addressesCollected !== 1 ? "s" : ""} to submit their
              shipping address via the mobile app.
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        {allAddressesCollected && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={onDownloadCSV}>
              <Download className="h-4 w-4 mr-2" />
              Download Shipping CSV
            </Button>
            <Button onClick={onEnterTracking}>
              <FileEdit className="h-4 w-4 mr-2" />
              Enter Tracking Codes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricBoxProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  total: number | null;
  complete?: boolean;
}

function MetricBox({ icon, label, value, total, complete }: MetricBoxProps) {
  return (
    <div className="p-4 rounded-lg bg-muted/50 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-xl font-bold">
        {value}
        {total !== null && (
          <span className="text-sm font-normal text-muted-foreground">
            /{total}
          </span>
        )}
        {complete && <span className="text-green-500 ml-1">✓</span>}
      </p>
    </div>
  );
}
