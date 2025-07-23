import { getClassesForTeacher, getSubject, getTeacher } from "@/lib/mock-data"
import { columns } from "./columns"
import { DataTable } from "@/components/common/data-table"
import { AppClass } from "@/lib/types";

// We need to fetch all classes for the admin view. 
// This is a simplified example. In a real app you'd likely fetch all unique classes.
async function getAllClasses(): Promise<AppClass[]> {
    // This is a mock implementation. You'd query your database for all classes.
    // For now, let's aggregate from a few known teachers.
    const teacher1Classes = await getClassesForTeacher("T001");
    const teacher2Classes = await getClassesForTeacher("T002");
    const teacher3Classes = await getClassesForTeacher("T003");
    return [...teacher1Classes, ...teacher2Classes, ...teacher3Classes];
}


export default async function ClassesAdminPage() {
  const classes = await getAllClasses();
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Classes</h2>
            <p className="text-muted-foreground">Manage all classes and their assignments.</p>
        </div>
      </div>
      <DataTable columns={columns} data={processedClasses} filterColumn="name" />
    </div>
  )
}
