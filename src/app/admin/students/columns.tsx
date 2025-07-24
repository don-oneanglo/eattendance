
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Student } from "@/lib/types"
import { EditStudentForm } from "./edit-student-form"
import { deleteStudent } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"


export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const student = row.original
        return (
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{student.name}</span>
            </div>
        )
    }
  },
  {
    accessorKey: "studentCode",
    header: "Student ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "campus",
    header: "Campus",
  },
  {
    accessorKey: "form",
    header: "Form",
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const student = row.original
      const { toast } = useToast()
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [isAlertOpen, setIsAlertOpen] = useState(false);

      const handleDelete = async () => {
        const result = await deleteStudent(student.id)
        if (result.success) {
          toast({ title: "Student Deleted", description: `${student.name} has been removed.` })
        } else {
          toast({ variant: "destructive", title: "Error", description: result.error })
        }
        setIsAlertOpen(false)
      }

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
                    <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(student.studentCode)}
                    >
                    Copy student ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                        <DropdownMenuItem>Edit Student</DropdownMenuItem>
                    </DialogTrigger>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          Delete Student
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
                </DropdownMenu>
                 <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Edit Student</DialogTitle>
                    <DialogDescription>
                        Update the details for {student.name}.
                    </DialogDescription>
                    </DialogHeader>
                    <EditStudentForm student={student} onSuccess={() => setIsDialogOpen(false)} />
                </DialogContent>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the student record for {student.name}.
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
      )
    },
  },
]
