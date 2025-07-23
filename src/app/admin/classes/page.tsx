import { classes, getSubject, getTeacher } from "@/lib/mock-data"
import { columns } from "./columns"
import { DataTable } from "@/components/common/data-table"

const processedClasses = classes.map(c => {
    const teacher = getTeacher(c.teacherId);
    const subject = getSubject(c.subjectId);
    return {
        ...c,
        teacherName: teacher?.name || 'N/A',
        subjectName: subject?.subject || 'N/A',
        studentCount: c.studentIds.length,
    }
})

export default function ClassesAdminPage() {
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
