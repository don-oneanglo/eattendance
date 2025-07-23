import { getAllTeachers } from "@/lib/mock-data"
import { columns } from "./columns"
import { DataTable } from "@/components/common/data-table" 

export default async function TeachersAdminPage() {
  const teachers = await getAllTeachers();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Teachers</h2>
            <p className="text-muted-foreground">Manage all teacher records in the system.</p>
        </div>
      </div>
      <DataTable columns={columns} data={teachers} filterColumn="name" />
    </div>
  )
}
