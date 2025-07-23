import { getAllStudents } from "@/lib/mock-data"
import { columns } from "./columns"
import { DataTable } from "@/components/common/data-table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"

// A mock form component for adding a student
const AddStudentForm = () => (
    <div className="p-2 space-y-4">
        <p className="text-sm text-muted-foreground">This is a placeholder for the add student form.</p>
        <Button>Save Student</Button>
    </div>
)

export default async function StudentsAdminPage() {
  const students = await getAllStudents();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Students</h2>
            <p className="text-muted-foreground">Manage all student records in the system.</p>
        </div>
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Student
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new student.
                    </DialogDescription>
                </DialogHeader>
                <AddStudentForm />
            </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={students} filterColumn="name" />
    </div>
  )
}
