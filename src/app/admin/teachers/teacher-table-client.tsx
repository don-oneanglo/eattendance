
"use client";

import { DataTable } from "@/components/common/data-table";
import { getColumns } from "./columns";
import type { Teacher } from "@/lib/types";

interface TeacherTableClientProps {
    data: Teacher[];
}

export function TeacherTableClient({ data }: TeacherTableClientProps) {
    const columns = getColumns();
    return <DataTable columns={columns} data={data} filterColumn="name" />;
}
