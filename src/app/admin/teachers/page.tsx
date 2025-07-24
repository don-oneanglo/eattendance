
import { getAllTeachers } from "@/lib/mock-data"
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AddTeacherForm } from "./add-teacher-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImportTeachers } from "./import-teachers";
import { TeacherTableClient } from "./teacher-table-client";


export default async function TeachersAdminPage() {
  const teachers = await getAllTeachers();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Teachers</h2>
            <p className="text-muted-foreground">Manage all teacher records in the system.</p>
        </div>
        <div className="flex items-center gap-2">
            <ImportTeachers />
            <Dialog>
            <DialogTrigger asChild>
                <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Teacher
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>
                    Fill in the details below to add a new teacher.
                </DialogDescription>
                </DialogHeader>
                <AddTeacherForm />
            </DialogContent>
            </Dialog>
        </div>
      </div>
      <TeacherTableClient data={teachers} />
    </div>
  )
}
