
"use client";

import { DataTable } from "@/components/common/data-table";
import { getColumns, ProcessedClass } from "./columns";
import type { Student, Teacher } from "@/lib/types";

interface ClassTableClientProps {
  data: ProcessedClass[];
  teachers: Teacher[];
  students: Student[];
}

export function ClassTableClient({ data, teachers, students }: ClassTableClientProps) {
  const columns = getColumns(teachers, students);

  return <DataTable columns={columns} data={data} filterColumn="name" />;
}
