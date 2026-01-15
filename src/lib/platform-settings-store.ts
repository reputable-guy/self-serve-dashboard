import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TrustPillar {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export interface DistributionFormula {
  dailySync: number;
  baseline: number;
  finalSurvey: number;
  weeklyBonus: number;
}

export interface PlatformSettings {
  heartbeatsPerDollar: number;
  defaultStudyDuration: number;
  distributionFormula: DistributionFormula;
  trustStackPillars: TrustPillar[];
}

interface PlatformSettingsStore extends PlatformSettings {
  // Actions
  setHeartbeatsPerDollar: (value: number) => void;
  setDefaultStudyDuration: (value: number) => void;
  setDistributionFormula: (formula: DistributionFormula) => void;
  updateTrustPillar: (id: string, updates: Partial<TrustPillar>) => void;
  resetToDefaults: () => void;
}

const DEFAULT_TRUST_PILLARS: TrustPillar[] = [
  {
    id: 'real-person',
    title: 'Real Person',
    description: 'Identity verification confirmed',
    enabled: true,
  },
  {
    id: 'real-device',
    title: 'Real Device',
    description: 'Wearable connected and syncing',
    enabled: true,
  },
  {
    id: 'real-participation',
    title: 'Real Participation',
    description: '28 days of active engagement',
    enabled: true,
  },
  {
    id: 'no-incentive',
    title: 'No Incentive to Lie',
    description: 'Same rebate regardless of outcome',
    enabled: true,
  },
];

const DEFAULT_DISTRIBUTION: DistributionFormula = {
  dailySync: 70,
  baseline: 10,
  finalSurvey: 10,
  weeklyBonus: 10,
};

const DEFAULT_SETTINGS: PlatformSettings = {
  heartbeatsPerDollar: 10,
  defaultStudyDuration: 28,
  distributionFormula: DEFAULT_DISTRIBUTION,
  trustStackPillars: DEFAULT_TRUST_PILLARS,
};

export const usePlatformSettingsStore = create<PlatformSettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setHeartbeatsPerDollar: (value) =>
        set({ heartbeatsPerDollar: value }),

      setDefaultStudyDuration: (value) =>
        set({ defaultStudyDuration: value }),

      setDistributionFormula: (formula) =>
        set({ distributionFormula: formula }),

      updateTrustPillar: (id, updates) =>
        set((state) => ({
          trustStackPillars: state.trustStackPillars.map((pillar) =>
            pillar.id === id ? { ...pillar, ...updates } : pillar
          ),
        })),

      resetToDefaults: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'reputable-platform-settings',
    }
  )
);

// Helper to calculate example heartbeat conversion
export function calculateHeartbeats(
  rebateAmount: number,
  heartbeatsPerDollar: number
): number {
  return rebateAmount * heartbeatsPerDollar;
}

// Helper to validate distribution formula totals 100%
export function validateDistribution(formula: DistributionFormula): boolean {
  const total =
    formula.dailySync + formula.baseline + formula.finalSurvey + formula.weeklyBonus;
  return total === 100;
}
