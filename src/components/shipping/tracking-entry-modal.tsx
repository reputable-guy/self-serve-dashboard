"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Circle, Info } from "lucide-react";
import type { Cohort, ParticipantShipping } from "@/lib/types";

interface TrackingEntryModalProps {
  open: boolean;
  onClose: () => void;
  cohort: Cohort;
  participants: ParticipantShipping[];
  onSave: (updates: { participantId: string; trackingNumber: string }[]) => void;
}

/**
 * Modal for entering individual tracking codes for each participant in a cohort.
 * Each tracking code must be tied to a specific participant address.
 */
export function TrackingEntryModal({
  open,
  onClose,
  cohort,
  participants,
  onSave,
}: TrackingEntryModalProps) {
  const [trackingCodes, setTrackingCodes] = useState<Record<string, string>>({});

  // Sync tracking codes from participants when modal opens or participants change
  useEffect(() => {
    if (open) {
      const initial: Record<string, string> = {};
      participants.forEach((p) => {
        if (p.trackingNumber) {
          initial[p.participantId] = p.trackingNumber;
        }
      });
      setTrackingCodes(initial);
    }
  }, [open, participants]);

  const enteredCount = Object.values(trackingCodes).filter(
    (code) => code && code.trim().length > 0
  ).length;
  const totalCount = participants.length;
  const progressPercent = Math.round((enteredCount / totalCount) * 100);

  const handleTrackingChange = (participantId: string, value: string) => {
    setTrackingCodes((prev) => ({
      ...prev,
      [participantId]: value,
    }));
  };

  const handleSave = () => {
    const updates = Object.entries(trackingCodes)
      .filter(([, code]) => code && code.trim().length > 0)
      .map(([participantId, trackingNumber]) => ({
        participantId,
        trackingNumber: trackingNumber.trim(),
      }));
    onSave(updates);
    onClose();
  };

  // Auto-detect carrier from tracking number format
  const detectCarrier = (trackingNumber: string): string | null => {
    if (!trackingNumber) return null;
    const code = trackingNumber.toUpperCase().trim();

    // UPS: 1Z followed by 16 alphanumeric characters
    if (/^1Z[A-Z0-9]{16}$/i.test(code)) return "UPS";

    // FedEx: 12, 15, or 20+ digits
    if (/^\d{12,15}$/.test(code) || /^\d{20,}$/.test(code)) return "FedEx";

    // USPS: 20-22 digits or starts with 94
    if (/^\d{20,22}$/.test(code) || /^94\d{18,}$/.test(code)) return "USPS";

    // DHL: 10 digits
    if (/^\d{10}$/.test(code)) return "DHL";

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Enter Tracking Codes - Cohort {cohort.cohortNumber}</DialogTitle>
          <DialogDescription>
            Enter a tracking code for each participant to enable delivery tracking
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="py-2">
          <div className="flex items-center gap-3 mb-2">
            <Progress value={progressPercent} className="flex-1" />
            <span className="text-sm font-medium">
              {enteredCount}/{totalCount} entered
            </span>
          </div>
        </div>

        {/* Participant List */}
        <div className="flex-1 overflow-y-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th className="text-left p-3 font-medium">Participant</th>
                <th className="text-left p-3 font-medium">Address</th>
                <th className="text-left p-3 font-medium">Tracking Code</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => {
                const hasTracking =
                  trackingCodes[participant.participantId]?.trim().length > 0;
                const carrier = detectCarrier(
                  trackingCodes[participant.participantId] || ""
                );

                return (
                  <tr
                    key={participant.participantId}
                    className="border-t hover:bg-muted/30"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {hasTracking ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className="font-medium">
                          {participant.displayName}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {participant.address ? (
                        <span className="text-xs">
                          {participant.address.street1},{" "}
                          {participant.address.city} {participant.address.state}
                        </span>
                      ) : (
                        <span className="text-xs italic">No address</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Enter tracking number"
                          value={trackingCodes[participant.participantId] || ""}
                          onChange={(e) =>
                            handleTrackingChange(
                              participant.participantId,
                              e.target.value
                            )
                          }
                          className="h-8 text-xs font-mono"
                        />
                        {carrier && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {carrier}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Info Alert */}
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-xs">
            Each tracking code is tied to a specific participant address. Once
            all tracking codes are entered, you&apos;ll be able to open the next
            recruitment window when ready.
            <br />
            <br />
            Can&apos;t ship to someone? Contact{" "}
            <a
              href="mailto:support@reputable.health"
              className="underline font-medium"
            >
              support@reputable.health
            </a>
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save & Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
