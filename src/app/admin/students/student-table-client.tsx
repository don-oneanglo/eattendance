
"use client";

import { DataTable } from "@/components/common/data-table";
import { getColumns } from "./columns";
import type { Student } from "@/lib/types";

interface StudentTableClientProps {
    data: Student[];
}

export function StudentTableClient({ data }: StudentTableClientProps) {
    const columns = getColumns();
    return <DataTable columns={columns} data={data} filterColumn="name" />;
}
