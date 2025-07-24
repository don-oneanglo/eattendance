
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { AppClass, Teacher, Student } from "@/lib/types"
import { deleteClass } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { EditClassForm } from "./edit-class-form"

export type ProcessedClass = AppClass & { teacherName: string, subjectName: string, studentCount: number }

type ActionCellProps = {
    row: { original: ProcessedClass };
    teachers: Teacher[];
    students: Student[];
}

const ActionCell: React.FC<ActionCellProps> = ({ row, teachers, students }) => {
    const cls = row.original;
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const handleDelete = async () => {
        const result = await deleteClass(cls.id);
        if (result.success) {
            toast({ title: "Class Deleted", description: `The class ${cls.name} has been removed.` });
        } else {
            toast({ variant: "destructive", title: "Error", description: result.error });
        }
        setIsAlertOpen(false);
    };

    return (
        <div className="text-right">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(cls.id)}>
                                Copy class ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                             <DialogTrigger asChild>
                                <DropdownMenuItem>Edit Class</DropdownMenuItem>
                            </DialogTrigger>
                             <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                    Delete Class
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Class</DialogTitle>
                            <DialogDescription>
                                Update the teacher and student roster for {cls.name}.
                            </DialogDescription>
                        </DialogHeader>
                        <EditClassForm
                            classData={cls}
                            teachers={teachers}
                            students={students}
                            onSuccess={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the class and all its enrollments.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Dialog>
        </div>
    );
};


export const getColumns = (teachers: Teacher[], students: Student[]): ColumnDef<ProcessedClass>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Class Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="pl-4 font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "subjectName",
    header: "Subject",
  },
  {
    accessorKey: "teacherName",
    header: "Teacher",
  },
  {
    accessorKey: "studentCount",
    header: "Students",
    cell: ({ row }) => <div className="text-center">{row.getValue("studentCount")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell row={row} teachers={teachers} students={students} />,
  },
]
