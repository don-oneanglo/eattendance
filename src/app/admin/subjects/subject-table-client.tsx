
"use client";

import { DataTable } from "@/components/common/data-table";
import { getColumns } from "./columns";
import type { SubjectSet } from "@/lib/types";

interface SubjectTableClientProps {
    data: SubjectSet[];
}

export function SubjectTableClient({ data }: SubjectTableClientProps) {
    const columns = getColumns();
    return <DataTable columns={columns} data={data} filterColumn="subject" />;
}
