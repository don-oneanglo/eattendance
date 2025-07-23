import { notFound } from "next/navigation";
import { getClass, getStudentsForClass, getSubject } from "@/lib/mock-data";
import { StudentRoster } from "./student-roster";
import { BookOpen, Users } from "lucide-react";

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
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">{classInfo.name}</h1>
        <div className="flex items-center gap-6 text-muted-foreground text-lg mt-2">
            <span className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> {subject?.name}</span>
            <span className="flex items-center gap-2"><Users className="h-5 w-5" /> {students.length} Students</span>
        </div>
      </div>

      <StudentRoster initialRoster={initialRoster} classId={classInfo.id} />
    </div>
  );
}
