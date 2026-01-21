/**
 * Cohort Store - Manages cohort-based recruitment state
 *
 * State machine:
 * - waitlist_only: Study visible, participants can join waitlist, no window open yet
 * - window_open: 24h recruitment window is active, participants enrolling
 * - window_closed: Window ended, processing cohort (addresses/shipping)
 * - complete: Study is full (totalEnrolled >= targetParticipants)
 *
 * Flow:
 * waitlist_only → [Go Live] → window_open → [24h elapsed] → window_closed
 * → [all tracking entered] → window_open (if not full) OR complete (if full)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Cohort,
  ParticipantShipping,
  StudyRecruitmentState,
  RecruitmentStatus,
} from "@/lib/types";

interface CohortStoreState {
  // Study recruitment states (keyed by studyId)
  recruitmentStates: Record<string, StudyRecruitmentState>;
  // Participant shipping records (keyed by participantId)
  participantShipping: Record<string, ParticipantShipping>;

  // Actions
  initializeStudy: (
    studyId: string,
    targetParticipants: number,
    waitlistCount?: number
  ) => void;
  goLive: (studyId: string) => void;
  openWindow: (studyId: string) => void; // Manual window open from ready_to_open state
  closeWindow: (studyId: string) => void;
  enterTrackingCode: (
    studyId: string,
    participantId: string,
    trackingNumber: string
  ) => void;
  getRecruitmentState: (studyId: string) => StudyRecruitmentState | undefined;
  getCohortParticipants: (cohortId: string) => ParticipantShipping[];

  // For demo purposes - simulate adding enrolled participants
  simulateEnrollment: (studyId: string, count: number) => void;
  // For demo purposes - simulate waitlist growth
  simulateWaitlistGrowth: (studyId: string, count: number) => void;
  // Reset store for testing
  resetStore: () => void;
}

// Generate a mock participant
function generateMockParticipant(
  studyId: string,
  cohortId: string,
  index: number
): ParticipantShipping {
  const firstNames = [
    "Sarah", "Mike", "Emily", "James", "Lisa", "David", "Anna", "Chris",
    "Rachel", "Kevin", "Jennifer", "Brian", "Michelle", "Steven", "Laura",
    "Daniel", "Amanda", "Mark", "Nicole", "Jason", "Stephanie", "Andrew",
  ];
  const lastInitials = ["M", "T", "R", "K", "W", "H", "P", "L", "S", "C", "N", "B"];
  const cities = [
    { city: "Austin", state: "TX" },
    { city: "Seattle", state: "WA" },
    { city: "Denver", state: "CO" },
    { city: "Portland", state: "OR" },
    { city: "Phoenix", state: "AZ" },
    { city: "San Diego", state: "CA" },
    { city: "Dallas", state: "TX" },
    { city: "Miami", state: "FL" },
    { city: "Atlanta", state: "GA" },
    { city: "Chicago", state: "IL" },
    { city: "Boston", state: "MA" },
  ];

  const firstName = firstNames[index % firstNames.length];
  const lastInitial = lastInitials[index % lastInitials.length];
  const displayName = `${firstName} ${lastInitial}.`;
  const location = cities[index % cities.length];
  const participantId = `${cohortId}-p${index}`;

  return {
    participantId,
    studyId,
    cohortId,
    status: "ready_to_ship",
    displayName,
    initials: `${firstName[0]}${lastInitial}`,
    address: {
      fullName: displayName,
      street1: `${100 + index * 111} ${["Main", "Oak", "Pine", "Elm", "Maple"][index % 5]} St`,
      city: location.city,
      state: location.state,
      zipCode: `${70000 + index * 1234}`,
    },
    enrolledAt: new Date().toISOString(),
  };
}

// Create a new cohort
function createCohort(
  studyId: string,
  cohortNumber: number,
  participantCount: number
): { cohort: Cohort; participants: ParticipantShipping[] } {
  const cohortId = `${studyId}-cohort-${cohortNumber}`;
  const participants: ParticipantShipping[] = [];

  for (let i = 0; i < participantCount; i++) {
    participants.push(generateMockParticipant(studyId, cohortId, i));
  }

  const cohort: Cohort = {
    id: cohortId,
    studyId,
    cohortNumber,
    status: "pending_shipment",
    windowOpenedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25h ago
    windowClosedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1h ago
    participantIds: participants.map((p) => p.participantId),
    addressesCollected: participantCount, // Assume all addresses collected
    trackingCodesEntered: 0,
    allTrackingEntered: false,
    deliveredCount: 0,
  };

  return { cohort, participants };
}

export const useCohortStore = create<CohortStoreState>()(
  persist(
    (set, get) => ({
      recruitmentStates: {},
      participantShipping: {},

      initializeStudy: (studyId, targetParticipants, waitlistCount = 50) => {
        set((state) => {
          // Don't reinitialize if already exists
          if (state.recruitmentStates[studyId]) {
            return state;
          }

          const newState: StudyRecruitmentState = {
            studyId,
            status: "waitlist_only",
            totalEnrolled: 0,
            targetParticipants,
            waitlistCount,
            currentWindowEnrolled: 0,
            cohorts: [],
          };

          return {
            recruitmentStates: {
              ...state.recruitmentStates,
              [studyId]: newState,
            },
          };
        });
      },

      goLive: (studyId) => {
        set((state) => {
          const current = state.recruitmentStates[studyId];
          if (!current || current.status !== "waitlist_only") {
            return state;
          }

          // Open first recruitment window and track waitlist at open
          const windowEndsAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
          const windowHistory = current.windowHistory || [];

          return {
            recruitmentStates: {
              ...state.recruitmentStates,
              [studyId]: {
                ...current,
                status: "window_open",
                currentWindowEndsAt: windowEndsAt,
                currentWindowEnrolled: 0,
                windowHistory: [
                  ...windowHistory,
                  { waitlistAtOpen: current.waitlistCount, enrolled: 0 },
                ],
              },
            },
          };
        });
      },

      openWindow: (studyId) => {
        set((state) => {
          const current = state.recruitmentStates[studyId];
          if (!current || current.status !== "ready_to_open") {
            return state;
          }

          // Check if study is already full
          if (current.totalEnrolled >= current.targetParticipants) {
            return {
              recruitmentStates: {
                ...state.recruitmentStates,
                [studyId]: {
                  ...current,
                  status: "complete",
                },
              },
            };
          }

          // Open recruitment window and track waitlist at open
          const windowEndsAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
          const windowHistory = current.windowHistory || [];

          return {
            recruitmentStates: {
              ...state.recruitmentStates,
              [studyId]: {
                ...current,
                status: "window_open",
                currentWindowEndsAt: windowEndsAt,
                currentWindowEnrolled: 0,
                windowHistory: [
                  ...windowHistory,
                  { waitlistAtOpen: current.waitlistCount, enrolled: 0 },
                ],
              },
            },
          };
        });
      },

      closeWindow: (studyId) => {
        set((state) => {
          const current = state.recruitmentStates[studyId];
          if (!current || current.status !== "window_open") {
            return state;
          }

          // If no one enrolled this window, go to ready_to_open (not waitlist_only)
          if (current.currentWindowEnrolled === 0) {
            // Update window history with 0 enrolled
            const windowHistory = [...(current.windowHistory || [])];
            if (windowHistory.length > 0) {
              windowHistory[windowHistory.length - 1].enrolled = 0;
            }
            const conversionRate = calculateConversionRate(windowHistory);

            return {
              recruitmentStates: {
                ...state.recruitmentStates,
                [studyId]: {
                  ...current,
                  status: "ready_to_open", // Ready to open next window
                  currentWindowEndsAt: undefined,
                  windowHistory,
                  conversionRate,
                },
              },
            };
          }

          // Create new cohort from enrolled participants
          const cohortNumber = current.cohorts.length + 1;
          const { cohort, participants } = createCohort(
            studyId,
            cohortNumber,
            current.currentWindowEnrolled
          );

          // Add participants to store
          const newParticipantShipping = { ...state.participantShipping };
          participants.forEach((p) => {
            newParticipantShipping[p.participantId] = p;
          });

          // Update window history with actual enrolled count
          const windowHistory = [...(current.windowHistory || [])];
          if (windowHistory.length > 0) {
            windowHistory[windowHistory.length - 1].enrolled = current.currentWindowEnrolled;
          }
          const conversionRate = calculateConversionRate(windowHistory);

          return {
            recruitmentStates: {
              ...state.recruitmentStates,
              [studyId]: {
                ...current,
                status: "window_closed", // Window closed, processing cohort
                currentCohort: cohort,
                totalEnrolled: current.totalEnrolled + current.currentWindowEnrolled,
                currentWindowEndsAt: undefined,
                currentWindowEnrolled: 0,
                cohorts: [...current.cohorts, cohort],
                windowHistory,
                conversionRate,
              },
            },
            participantShipping: newParticipantShipping,
          };
        });
      },

      enterTrackingCode: (studyId, participantId, trackingNumber) => {
        set((state) => {
          const participant = state.participantShipping[participantId];
          if (!participant) return state;

          // Update participant
          const updatedParticipant: ParticipantShipping = {
            ...participant,
            trackingNumber,
            trackingCarrier: detectCarrier(trackingNumber),
            status: "shipped",
            shippedAt: new Date().toISOString(),
          };

          // Update cohort tracking count
          const recruitmentState = state.recruitmentStates[studyId];
          if (!recruitmentState?.currentCohort) return state;

          const currentCohort = recruitmentState.currentCohort;
          const newTrackingCount = currentCohort.trackingCodesEntered + 1;
          const allEntered = newTrackingCount >= currentCohort.participantIds.length;

          const updatedCohort: Cohort = {
            ...currentCohort,
            trackingCodesEntered: newTrackingCount,
            allTrackingEntered: allEntered,
            status: allEntered ? "complete" : "shipping",
          };

          // Check if all tracking codes entered - transition to ready_to_open (not auto-open)
          let newStatus: RecruitmentStatus = recruitmentState.status;
          const newWindowEndsAt = recruitmentState.currentWindowEndsAt;
          let newCurrentCohort: Cohort | undefined = updatedCohort;

          if (allEntered) {
            // All tracking entered! Check if study is full
            if (recruitmentState.totalEnrolled >= recruitmentState.targetParticipants) {
              newStatus = "complete";
              newCurrentCohort = undefined; // No active cohort
            } else {
              // Ready to open next window (manual control)
              newStatus = "ready_to_open";
              newCurrentCohort = undefined; // Previous cohort is complete, no active one yet
            }
          }

          // Update cohorts array
          const updatedCohorts = recruitmentState.cohorts.map((c) =>
            c.id === updatedCohort.id ? updatedCohort : c
          );

          return {
            participantShipping: {
              ...state.participantShipping,
              [participantId]: updatedParticipant,
            },
            recruitmentStates: {
              ...state.recruitmentStates,
              [studyId]: {
                ...recruitmentState,
                status: newStatus,
                currentCohort: newCurrentCohort,
                currentWindowEndsAt: allEntered ? undefined : newWindowEndsAt,
                currentWindowEnrolled: recruitmentState.currentWindowEnrolled,
                cohorts: updatedCohorts,
              },
            },
          };
        });
      },

      getRecruitmentState: (studyId) => {
        return get().recruitmentStates[studyId];
      },

      getCohortParticipants: (cohortId) => {
        const allParticipants = Object.values(get().participantShipping);
        return allParticipants.filter((p) => p.cohortId === cohortId);
      },

      simulateEnrollment: (studyId, count) => {
        set((state) => {
          const current = state.recruitmentStates[studyId];
          if (!current || current.status !== "window_open") {
            return state;
          }

          // Can't exceed remaining capacity
          const remaining = current.targetParticipants - current.totalEnrolled;
          const actualCount = Math.min(count, remaining);

          return {
            recruitmentStates: {
              ...state.recruitmentStates,
              [studyId]: {
                ...current,
                currentWindowEnrolled: current.currentWindowEnrolled + actualCount,
                waitlistCount: Math.max(0, current.waitlistCount - actualCount),
              },
            },
          };
        });
      },

      simulateWaitlistGrowth: (studyId, count) => {
        set((state) => {
          const current = state.recruitmentStates[studyId];
          if (!current) {
            return state;
          }

          return {
            recruitmentStates: {
              ...state.recruitmentStates,
              [studyId]: {
                ...current,
                waitlistCount: current.waitlistCount + count,
              },
            },
          };
        });
      },

      resetStore: () => {
        set({
          recruitmentStates: {},
          participantShipping: {},
        });
      },
    }),
    {
      name: "cohort-storage",
    }
  )
);

// Helper to detect carrier from tracking number
function detectCarrier(trackingNumber: string): string | undefined {
  if (!trackingNumber) return undefined;
  const code = trackingNumber.toUpperCase().trim();

  if (/^1Z[A-Z0-9]{16}$/i.test(code)) return "UPS";
  if (/^\d{12,15}$/.test(code) || /^\d{20,}$/.test(code)) return "FedEx";
  if (/^\d{20,22}$/.test(code) || /^94\d{18,}$/.test(code)) return "USPS";
  if (/^\d{10}$/.test(code)) return "DHL";

  return undefined;
}

// Helper to calculate historical conversion rate
function calculateConversionRate(
  windowHistory: Array<{ waitlistAtOpen: number; enrolled: number }>
): number {
  if (windowHistory.length === 0) return 0.35; // Default estimate: 35%

  const totalWaitlist = windowHistory.reduce((sum, w) => sum + w.waitlistAtOpen, 0);
  const totalEnrolled = windowHistory.reduce((sum, w) => sum + w.enrolled, 0);

  if (totalWaitlist === 0) return 0.35;
  return totalEnrolled / totalWaitlist;
}
