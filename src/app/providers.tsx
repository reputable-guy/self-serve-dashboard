"use client";

import { StudiesProvider } from "@/lib/studies-store";

export function Providers({ children }: { children: React.ReactNode }) {
  return <StudiesProvider>{children}</StudiesProvider>;
}
