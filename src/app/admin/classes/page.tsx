import { getAllClasses } from "@/lib/mock-data"
import { columns } from "./columns"
import { DataTable } from "@/components/common/data-table"
import { AppClass } from "@/lib/types";
import { getTeacher, getSubject } from "@/lib/mock-data";


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
