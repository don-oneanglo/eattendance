import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Clock, Users } from "lucide-react";
import { getClassesForTeacher, getSubject, getTeacher } from "@/lib/mock-data";

export default function DashboardPage() {
  // In a real app, you'd get this from the user's session
  const teacherId = "T01";
  const teacher = getTeacher(teacherId);
  const classes = getClassesForTeacher(teacherId);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Welcome, {teacher?.name}!</h1>
        <p className="text-muted-foreground text-lg">Here are your classes for today. Select a class to start taking attendance.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => {
          const subject = getSubject(cls.subjectId);
          return (
            <Link href={`/class/${cls.id}`} key={cls.id} className="group">
              <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-primary">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{cls.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 pt-1">
                    <BookOpen className="h-4 w-4" />
                    {subject?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                   <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{cls.time} {cls.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Users className="h-4 w-4" />
                       <span>{cls.studentIds.length} students</span>
                    </div>
                   </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center text-primary font-bold">
                  <span>Take Attendance</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
