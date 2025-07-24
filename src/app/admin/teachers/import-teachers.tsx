
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImportCSV } from "@/components/common/import-csv";
import { importTeachers } from "@/lib/actions";
import { Upload } from "lucide-react";
import type { Teacher } from "@/lib/types";

type TeacherCSV = Omit<Teacher, 'id' | 'avatarUrl'> & {
    teacherCode: string;
    name: string;
    nickname: string;
    email: string;
    campus: string;
    department: string;
};

export function ImportTeachers() {
  const [isOpen, setIsOpen] = useState(false);

  const requiredHeaders: (keyof TeacherCSV)[] = [
    "teacherCode",
    "name",
    "nickname",
    "email",
    "campus",
    "department",
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
        <ImportCSV<TeacherCSV>
          onImport={importTeachers}
          requiredHeaders={requiredHeaders}
          onSuccess={() => setIsOpen(false)}
          dialogTitle="Import Teachers"
          dialogDescription="Upload a CSV with teacher data. 'teacherCode' is used as the unique identifier for updates."
        />
      </DialogContent>
    </Dialog>
  );
}
