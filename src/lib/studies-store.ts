"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Study {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  category: string;
  categoryKey: string;
  categoryLabel: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  tier: number;
  participants: number;
  targetParticipants: number;
  startDate: string | null;
  endDate: string | null;
  rebateAmount: number;
  hasWearables: boolean;
  productDescription: string;
  productImage: string;
  hookQuestion: string;
  studyTitle: string;
  whatYoullDiscover: string[];
  dailyRoutine: string;
  howItWorks: string;
  whatYoullDoSections?: Array<{
    sectionTitle: string;
    items: Array<{ icon: string; title: string; subtitle: string }>;
  }>;
  whatYoullGet?: Array<{
    icon: string;
    item: string;
    note: string;
    value: string;
  }>;
  // Legacy fields for backward compatibility
  productName?: string;
  durationDays?: number;
  requiredDevice?: string;
  villainVariable?: string;
  villainQuestionDays?: number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customQuestions?: any[];
  createdAt: string;
  updatedAt: string;
}

const SEED_STUDIES: Study[] = [
  {
    id: "study-1",
    name: "SleepWell Premium",
    brandId: "brand-acme",
    brandName: "Acme Supplements",
    category: "sleep",
    categoryKey: "sleep",
    categoryLabel: "Sleep",
    status: "active",
    tier: 1,
    participants: 45,
    targetParticipants: 50,
    startDate: "2024-11-01T00:00:00.000Z",
    endDate: "2024-11-29T00:00:00.000Z",
    rebateAmount: 50,
    hasWearables: true,
    productDescription: "Natural sleep supplement formulated to improve sleep quality and duration",
    productImage: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=600&fit=crop",
    hookQuestion: "Can SleepWell Premium help you sleep better?",
    studyTitle: "SleepWell Premium Study",
    whatYoullDiscover: [
      "How SleepWell Premium affects your sleep quality and duration",
      "Whether you wake up feeling more refreshed",
      "Changes in your deep sleep and REM patterns",
      "Your overall sleep consistency over 28 days",
    ],
    dailyRoutine: "Take SleepWell Premium before bed. Your wearable tracks sleep automatically. Quick daily check-in takes ~30 seconds.",
    howItWorks: "SleepWell Premium contains a blend of natural ingredients including magnesium, L-theanine, and melatonin that work together to support healthy sleep patterns.",
    createdAt: "2024-10-15T00:00:00.000Z",
    updatedAt: "2024-10-15T00:00:00.000Z",
  },
  {
    id: "study-2",
    name: "Recovery Plus",
    brandId: "brand-acme",
    brandName: "Acme Supplements",
    category: "recovery",
    categoryKey: "recovery",
    categoryLabel: "Recovery",
    status: "active",
    tier: 1,
    participants: 32,
    targetParticipants: 40,
    startDate: "2024-11-15T00:00:00.000Z",
    endDate: "2024-12-13T00:00:00.000Z",
    rebateAmount: 45,
    hasWearables: true,
    productDescription: "Advanced recovery formula for post-workout muscle recovery",
    productImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
    hookQuestion: "Can Recovery Plus speed up your recovery?",
    studyTitle: "Recovery Plus Study",
    whatYoullDiscover: [
      "How Recovery Plus affects your post-workout recovery",
      "Changes in your HRV and recovery scores",
      "Whether muscle soreness decreases faster",
      "Your overall recovery consistency",
    ],
    dailyRoutine: "Take Recovery Plus after workouts. Your wearable tracks recovery metrics automatically.",
    howItWorks: "Recovery Plus contains BCAAs, electrolytes, and anti-inflammatory compounds designed to accelerate post-workout recovery.",
    createdAt: "2024-11-01T00:00:00.000Z",
    updatedAt: "2024-11-01T00:00:00.000Z",
  },
  {
    id: "study-3",
    name: "Calm Focus Formula",
    brandId: "brand-zenwell",
    brandName: "ZenWell",
    category: "stress",
    categoryKey: "stress",
    categoryLabel: "Stress Management",
    status: "active",
    tier: 2,
    participants: 28,
    targetParticipants: 35,
    startDate: "2024-11-10T00:00:00.000Z",
    endDate: "2024-12-08T00:00:00.000Z",
    rebateAmount: 55,
    hasWearables: true,
    productDescription: "Natural stress relief supplement for better focus and calm",
    productImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    hookQuestion: "Can Calm Focus Formula reduce your stress?",
    studyTitle: "Calm Focus Formula Study",
    whatYoullDiscover: [
      "How Calm Focus Formula affects your daily stress levels",
      "Whether your focus and concentration improve",
      "Changes in your HRV indicating stress resilience",
      "Your stress patterns over 28 days",
    ],
    dailyRoutine: "Take Calm Focus Formula each morning. Complete weekly stress assessment.",
    howItWorks: "Calm Focus Formula combines adaptogenic herbs like ashwagandha and rhodiola with L-theanine to support stress resilience.",
    createdAt: "2024-11-05T00:00:00.000Z",
    updatedAt: "2024-11-05T00:00:00.000Z",
  },
  {
    id: "study-4",
    name: "Energy Boost Complex",
    brandId: "brand-vitality",
    brandName: "Vitality Labs",
    category: "energy",
    categoryKey: "energy",
    categoryLabel: "Energy & Vitality",
    status: "active",
    tier: 3,
    participants: 22,
    targetParticipants: 30,
    startDate: "2024-11-20T00:00:00.000Z",
    endDate: "2024-12-18T00:00:00.000Z",
    rebateAmount: 50,
    hasWearables: false,
    productDescription: "All-day energy supplement without jitters or crashes",
    productImage: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=600&fit=crop",
    hookQuestion: "Can Energy Boost Complex give you all-day energy?",
    studyTitle: "Energy Boost Complex Study",
    whatYoullDiscover: [
      "How Energy Boost Complex affects your daily energy levels",
      "Whether afternoon crashes become less frequent",
      "Changes in your overall vitality and motivation",
      "Your energy consistency throughout the day",
    ],
    dailyRoutine: "Take Energy Boost Complex in the morning. Complete weekly energy assessment.",
    howItWorks: "Energy Boost Complex uses sustained-release B vitamins, CoQ10, and natural caffeine from green tea.",
    createdAt: "2024-11-15T00:00:00.000Z",
    updatedAt: "2024-11-15T00:00:00.000Z",
  },
  {
    id: "study-5",
    name: "Gut Health Pro",
    brandId: "brand-acme",
    brandName: "Acme Supplements",
    category: "gut",
    categoryKey: "gut",
    categoryLabel: "Gut Health",
    status: "completed",
    tier: 4,
    participants: 50,
    targetParticipants: 50,
    startDate: "2024-09-01T00:00:00.000Z",
    endDate: "2024-09-29T00:00:00.000Z",
    rebateAmount: 50,
    hasWearables: false,
    productDescription: "Probiotic blend for digestive wellness and gut balance",
    productImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop",
    hookQuestion: "Can Gut Health Pro improve your digestion?",
    studyTitle: "Gut Health Pro Study",
    whatYoullDiscover: [
      "How Gut Health Pro affects your digestive comfort",
      "Whether bloating and discomfort decrease",
      "Changes in your gut health symptoms",
      "Your digestive patterns over 28 days",
    ],
    dailyRoutine: "Take Gut Health Pro daily. Complete weekly gut health assessment.",
    howItWorks: "Gut Health Pro contains 50 billion CFU of clinically-studied probiotic strains plus prebiotic fiber.",
    createdAt: "2024-08-15T00:00:00.000Z",
    updatedAt: "2024-09-29T00:00:00.000Z",
  },
  {
    id: "study-6",
    name: "Focus Flow",
    brandId: "brand-zenwell",
    brandName: "ZenWell",
    category: "focus",
    categoryKey: "focus",
    categoryLabel: "Focus & Concentration",
    status: "completed",
    tier: 3,
    participants: 45,
    targetParticipants: 50,
    startDate: "2024-08-15T00:00:00.000Z",
    endDate: "2024-09-12T00:00:00.000Z",
    rebateAmount: 60,
    hasWearables: false,
    productDescription: "Nootropic blend for enhanced mental clarity and focus",
    productImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
    hookQuestion: "Can Focus Flow sharpen your mental clarity?",
    studyTitle: "Focus Flow Study",
    whatYoullDiscover: [
      "How Focus Flow affects your concentration",
      "Whether mental fatigue decreases",
      "Changes in your cognitive performance",
      "Your focus patterns throughout the day",
    ],
    dailyRoutine: "Take Focus Flow in the morning. Complete weekly focus assessment.",
    howItWorks: "Focus Flow combines lion's mane, bacopa, and alpha-GPC for enhanced cognitive function.",
    createdAt: "2024-08-01T00:00:00.000Z",
    updatedAt: "2024-09-12T00:00:00.000Z",
  },
];

interface StudiesStore {
  studies: Study[];
  addStudy: (study: Omit<Study, 'id' | 'createdAt' | 'updatedAt' | 'participants'>) => Study;
  updateStudy: (id: string, updates: Partial<Study>) => void;
  deleteStudy: (id: string) => void;
  getStudyById: (id: string) => Study | undefined;
  getStudy: (id: string) => Study | undefined; // Alias for legacy pages
  getStudiesByBrandId: (brandId: string) => Study[];
  launchStudy: (id: string) => void;
  resetToSeedData: () => void;
}

function generateId(): string {
  return `study-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useStudiesStore = create<StudiesStore>()(
  persist(
    (set, get) => ({
      studies: SEED_STUDIES,

      addStudy: (studyData) => {
        const now = new Date().toISOString();
        const newStudy: Study = {
          ...studyData,
          id: generateId(),
          participants: 0,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          studies: [...state.studies, newStudy],
        }));

        return newStudy;
      },

      updateStudy: (id, updates) => {
        set((state) => ({
          studies: state.studies.map((study) =>
            study.id === id
              ? { ...study, ...updates, updatedAt: new Date().toISOString() }
              : study
          ),
        }));
      },

      deleteStudy: (id) => {
        set((state) => ({
          studies: state.studies.filter((study) => study.id !== id),
        }));
      },

      getStudyById: (id) => {
        return get().studies.find((study) => study.id === id);
      },

      // Alias for legacy pages
      getStudy: (id) => {
        return get().studies.find((study) => study.id === id);
      },

      getStudiesByBrandId: (brandId) => {
        return get().studies.filter((study) => study.brandId === brandId);
      },

      launchStudy: (id) => {
        const now = new Date();
        const endDate = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000);
        set((state) => ({
          studies: state.studies.map((study) =>
            study.id === id
              ? {
                  ...study,
                  status: 'active' as const,
                  startDate: now.toISOString(),
                  endDate: endDate.toISOString(),
                  updatedAt: now.toISOString(),
                }
              : study
          ),
        }));
      },

      resetToSeedData: () => {
        set({ studies: SEED_STUDIES });
      },
    }),
    {
      name: 'reputable-studies',
    }
  )
);

// Alias for backward compatibility with legacy pages
export const useStudies = useStudiesStore;
