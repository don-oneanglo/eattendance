
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImportCSV } from "@/components/common/import-csv";
import { importSubjects } from "@/lib/actions";
import { Upload } from "lucide-react";
import type { SubjectSet } from "@/lib/types";


type SubjectCSV = Omit<SubjectSet, 'id'> & {
    subjectSetId: string;
    subject: string;
    description: string;
    campus: string;
    credits: number;
};


export function ImportSubjects() {
  const [isOpen, setIsOpen] = useState(false);

  const requiredHeaders: (keyof SubjectCSV)[] = [
    "subjectSetId",
    "subject",
    "description",
    "campus",
    "credits",
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
        <ImportCSV<SubjectCSV>
          onImport={importSubjects}
          requiredHeaders={requiredHeaders}
          onSuccess={() => setIsOpen(false)}
          dialogTitle="Import Subjects"
          dialogDescription="Upload a CSV with subject data. 'subjectSetId' is used as the unique identifier for updates."
        />
      </DialogContent>
    </Dialog>
  );
}
