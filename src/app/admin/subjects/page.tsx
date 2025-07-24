
import { getAllSubjects } from "@/lib/mock-data"
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AddSubjectForm } from "./add-subject-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImportSubjects } from "./import-subjects";
import { SubjectTableClient } from "./subject-table-client";


export default async function SubjectsAdminPage() {
  const subjects = await getAllSubjects();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Subjects</h2>
            <p className="text-muted-foreground">Manage all subjects and course materials.</p>
        </div>
        <div className="flex items-center gap-2">
            <ImportSubjects />
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Subject
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Add New Subject</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new subject.
                    </DialogDescription>
                    </DialogHeader>
                    <AddSubjectForm />
                </DialogContent>
            </Dialog>
        </div>
      </div>
      <SubjectTableClient data={subjects} />
    </div>
  )
}
