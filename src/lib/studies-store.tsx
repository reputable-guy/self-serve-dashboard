"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { StudyFormData } from "./study-context";

export interface Study extends StudyFormData {
  id: string;
  status: "draft" | "recruiting" | "filling-fast" | "full" | "completed";
  createdAt: Date;
  enrolledCount: number;
}

interface StudiesContextType {
  studies: Study[];
  addStudy: (study: StudyFormData) => string;
  getStudy: (id: string) => Study | undefined;
  updateStudy: (id: string, updates: Partial<Study>) => void;
  deleteStudy: (id: string) => void;
}

const StudiesContext = createContext<StudiesContextType | undefined>(undefined);

export function StudiesProvider({ children }: { children: ReactNode }) {
  const [studies, setStudies] = useState<Study[]>([]);

  const addStudy = (studyData: StudyFormData): string => {
    const id = `study-${Date.now()}`;
    const newStudy: Study = {
      ...studyData,
      id,
      status: "draft",
      createdAt: new Date(),
      enrolledCount: 0,
    };
    setStudies((prev) => [newStudy, ...prev]);
    return id;
  };

  const getStudy = (id: string): Study | undefined => {
    return studies.find((s) => s.id === id);
  };

  const updateStudy = (id: string, updates: Partial<Study>) => {
    setStudies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteStudy = (id: string) => {
    setStudies((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <StudiesContext.Provider
      value={{ studies, addStudy, getStudy, updateStudy, deleteStudy }}
    >
      {children}
    </StudiesContext.Provider>
  );
}

export function useStudies() {
  const context = useContext(StudiesContext);
  if (context === undefined) {
    throw new Error("useStudies must be used within a StudiesProvider");
  }
  return context;
}
