
import { AppHeader } from "@/components/common/header";
import { getTeacherFromSession } from "@/lib/actions";
import { redirect } from 'next/navigation';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const teacher = await getTeacherFromSession();

  if (!teacher) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader teacherName={teacher?.name} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
