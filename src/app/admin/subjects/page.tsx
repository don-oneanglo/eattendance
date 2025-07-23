import { subjects } from "@/lib/mock-data"
import { columns } from "./columns"
import { DataTable } from "../students/data-table"

export default function SubjectsAdminPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Subjects</h2>
            <p className="text-muted-foreground">Manage all subjects and course materials.</p>
        </div>
      </div>
      <DataTable columns={columns} data={subjects} />
    </div>
  )
}
