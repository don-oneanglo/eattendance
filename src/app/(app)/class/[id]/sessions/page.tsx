import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, ArrowRight, Clock, Calendar } from "lucide-react";
import { getClass, getSessionsForClass, getSubject } from "@/lib/mock-data";

type SessionsPageProps = {
  params: { id: string };
};

export default function SessionsPage({ params }: SessionsPageProps) {
  const classInfo = getClass(params.id);
  
  if (!classInfo) {
    notFound();
  }

  const sessions = getSessionsForClass(params.id);
  const subject = getSubject(classInfo.subjectId);

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-4xl font-bold">Sessions for {classInfo.name}</h1>
          <p className="text-muted-foreground text-lg">Manage attendance for each session.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Session
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <Card key={session.id} className="group flex flex-col">
            <CardHeader>
              <CardTitle>{session.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 pt-1">
                <Calendar className="h-4 w-4" />
                {new Date(session.date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{session.startTime} - {session.endTime}</span>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Link href={`/class/${params.id}/session/${session.id}`}>
                <Button className="w-full">
                  Take Attendance
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
         {sessions.length === 0 && (
            <Card className="md:col-span-3 text-center p-8">
                <p className="text-muted-foreground">No sessions found for this class yet. Click "Add New Session" to get started.</p>
            </Card>
         )}
      </div>
    </div>
  );
}
