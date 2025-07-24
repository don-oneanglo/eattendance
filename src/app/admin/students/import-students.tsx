
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImportCSV } from "@/components/common/import-csv";
import { importStudents } from "@/lib/actions";
import { Upload } from "lucide-react";
import type { Student } from "@/lib/types";

// The fields from the CSV must match the expected type, even if some are optional in the DB
type StudentCSV = Omit<Student, 'id' | 'avatarUrl'> & {
    studentCode: string;
    name: string;
    nickname: string;
    email: string;
    campus: string;
    form: string;
};

export function ImportStudents() {
  const [isOpen, setIsOpen] = useState(false);

  // Define the headers required in the CSV file.
  const requiredHeaders: (keyof StudentCSV)[] = [
    "studentCode",
    "name",
    "nickname",
    "email",
    "campus",
    "form",
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
        <ImportCSV<StudentCSV>
          onImport={importStudents}
          requiredHeaders={requiredHeaders}
          onSuccess={() => setIsOpen(false)}
          dialogTitle="Import Students"
          dialogDescription="Upload a CSV with student data. 'studentCode' is used as the unique identifier for updates."
        />
      </DialogContent>
    </Dialog>
  );
}
