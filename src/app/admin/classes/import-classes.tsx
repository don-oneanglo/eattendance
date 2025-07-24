
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ImportCSV } from "@/components/common/import-csv"
import { importClasses } from "@/lib/actions"
import { Upload } from "lucide-react"

type ClassCSV = {
    Campus: string;
    SubjectSetID: string;
    TeacherCode: string;
    StudentCode: string;
}

export function ImportClasses() {
  const [isOpen, setIsOpen] = useState(false);

  const requiredHeaders: (keyof ClassCSV)[] = [
    "Campus",
    "SubjectSetID",
    "TeacherCode",
    "StudentCode",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ImportCSV<ClassCSV>
          onImport={importClasses}
          requiredHeaders={requiredHeaders}
          onSuccess={() => setIsOpen(false)}
          dialogTitle="Import Classes"
          dialogDescription="Import class enrollments from a CSV file. Each row represents one student assigned to a class."
        />
      </DialogContent>
    </Dialog>
  );
}
