
import { getAllClasses, getAllStudents, getAllTeachers, getSubject } from "@/lib/mock-data";
import { ImportClasses } from "./import-classes";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ClassTableClient } from "./class-table-client";
import { ProcessedClass } from "./columns";


export default async function ClassesAdminPage() {
  const classes = await getAllClasses();
  const teachers = await getAllTeachers();
  const students = await getAllStudents();

  const processedClasses: ProcessedClass[] = await Promise.all(classes.map(async c => {
      const teacher = await getTeacher(c.teacherId);
      const subject = await getSubject(c.subjectId);
      return {
          ...c,
          teacherName: teacher?.name || 'N/A',
          subjectName: subject?.subject || 'N/A',
          studentCount: c.studentIds.length,
      }
  }));


  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Classes</h2>
            <p className="text-muted-foreground">Manage all classes and their assignments.</p>
        </div>
        <div className="flex items-center gap-2">
            <ImportClasses />
            <Button disabled>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Class
            </Button>
        </div>
      </div>
      <ClassTableClient data={processedClasses} teachers={teachers} students={students} />
    </div>
  )
}
