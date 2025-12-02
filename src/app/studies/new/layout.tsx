import { StudyProvider } from "@/lib/study-context";

export default function CreateStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudyProvider>{children}</StudyProvider>;
}
