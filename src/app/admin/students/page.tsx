
import { getAllStudents } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AddStudentForm } from "./add-student-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImportStudents } from "./import-students";
import { StudentTableClient } from "./student-table-client";

export default async function StudentsAdminPage() {
  const students = await getAllStudents();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Students</h2>
          <p className="text-muted-foreground">Manage all student records in the system.</p>
        </div>
        <div className="flex items-center gap-2">
            <ImportStudents />
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
      </div>
      <StudentTableClient data={students} />
    </div>
  );
}
