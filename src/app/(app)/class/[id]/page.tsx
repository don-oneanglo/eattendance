import { notFound } from "next/navigation";
import { getClass, getStudentsForClass, getSubject } from "@/lib/mock-data";
import { StudentRoster } from "./student-roster";
import { BookOpen, Users } from "lucide-react";
import { CameraView } from "./camera-view";

type ClassPageProps = {
  params: { id: string };
};

export default function ClassPage({ params }: ClassPageProps) {
  const classInfo = getClass(params.id);
  
  if (!classInfo) {
    notFound();
  }

  const students = getStudentsForClass(params.id);
  const subject = getSubject(classInfo.subjectId);

  const initialRoster = students.map(student => ({
    ...student,
    status: 'absent' as const,
  }));

  return (
    <div className="container py-8 flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">{classInfo.name}</h1>
        <div className="flex items-center gap-6 text-muted-foreground text-lg mt-2">
            <span className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> {subject?.subject}</span>
            <span className="flex items-center gap-2"><Users className="h-5 w-5" /> {students.length} Students</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 flex-1">
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold font-headline">Face Scanner</h2>
            <CameraView classId={classInfo.id} />
        </div>
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold font-headline">Attendance Roster</h2>
            <StudentRoster initialRoster={initialRoster} classId={classInfo.id} />
        </div>
      </div>
    </div>
  );
}
