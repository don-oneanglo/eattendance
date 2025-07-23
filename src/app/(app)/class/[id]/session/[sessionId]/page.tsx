import { notFound } from "next/navigation";
import { getClass, getStudentsForClass, getSubject, getSession } from "@/lib/mock-data";
import { StudentRoster } from "../../student-roster";
import { BookOpen, Users, Calendar, Clock } from "lucide-react";
import { CameraView } from "../../camera-view";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

type ClassSessionPageProps = {
  params: { id: string; sessionId: string };
};

export default function ClassSessionPage({ params }: ClassSessionPageProps) {
  const classInfo = getClass(params.id);
  const sessionInfo = getSession(parseInt(params.sessionId, 10));
  
  if (!classInfo || !sessionInfo) {
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
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link href={`/class/${params.id}/sessions`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Sessions
          </Link>
        </Button>
        <h1 className="font-headline text-4xl font-bold">{sessionInfo.name}</h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-lg mt-2">
            <span className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> {subject?.subject}</span>
            <span className="flex items-center gap-2"><Users className="h-5 w-5" /> {students.length} Students</span>
            <span className="flex items-center gap-2"><Calendar className="h-5 w-5" /> {new Date(sessionInfo.date).toLocaleDateString()}</span>
            <span className="flex items-center gap-2"><Clock className="h-5 w-5" /> {sessionInfo.startTime} - {sessionInfo.endTime}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-[auto,1fr] gap-8 flex-1">
        <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold font-headline text-center md:text-left">Face Scanner</h2>
            <CameraView classId={classInfo.id} />
        </div>
        <div className="flex flex-col gap-4 min-w-0">
            <h2 className="text-2xl font-bold font-headline">Attendance Roster</h2>
            <StudentRoster initialRoster={initialRoster} classId={classInfo.id} />
        </div>
      </div>
    </div>
  );
}
