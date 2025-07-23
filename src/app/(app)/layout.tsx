import { AppHeader } from "@/components/common/header";
import { getTeacher } from "@/lib/mock-data";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // In a real app, you'd get the logged-in user's ID from a session
  const teacher = getTeacher("T001");

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader teacherName={teacher?.name} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
