
import { getAllClasses, getAllStudents, getAllTeachers } from "@/lib/mock-data"
import { getColumns } from "./columns"
import { DataTable } from "@/components/common/data-table"
import { getTeacher, getSubject } from "@/lib/mock-data";
import { ImportClasses } from "./import-classes";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";


export default async function ClassesAdminPage() {
  const classes = await getAllClasses();
  const teachers = await getAllTeachers();
  const students = await getAllStudents();

  const processedClasses = await Promise.all(classes.map(async c => {
      const teacher = await getTeacher(c.teacherId);
      const subject = await getSubject(c.subjectId);
      return {
          ...c,
          teacherName: teacher?.name || 'N/A',
          subjectName: subject?.subject || 'N/A',
          studentCount: c.studentIds.length,
      }
  }));

  const columns = getColumns(teachers, students);

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
      <DataTable columns={columns} data={processedClasses} filterColumn="name" />
    </div>
  )
}
