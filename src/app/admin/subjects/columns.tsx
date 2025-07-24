
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
import type { SubjectSet } from "@/lib/types"
import { EditSubjectForm } from "./edit-subject-form"
import { deleteSubject } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export const getColumns = (): ColumnDef<SubjectSet>[] => [
  {
    accessorKey: "subject",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Subject
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
     cell: ({ row }) => <div className="pl-4 font-medium">{row.getValue("subject")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div className="max-w-xs truncate">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "subjectSetId",
    header: "Subject ID",
  },
    {
    accessorKey: "credits",
    header: "Credits",
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const subject = row.original
      const { toast } = useToast()
      const [isDialogOpen, setIsDialogOpen] = useState(false)
      const [isAlertOpen, setIsAlertOpen] = useState(false)

      const handleDelete = async () => {
        const result = await deleteSubject(subject.id)
        if (result.success) {
          toast({ title: "Subject Deleted", description: `${subject.subject} has been removed.` })
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
                    onClick={() => navigator.clipboard.writeText(subject.subjectSetId)}
                    >
                    Copy subject ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                      <DropdownMenuItem>Edit Subject</DropdownMenuItem>
                    </DialogTrigger>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          Delete Subject
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Subject</DialogTitle>
                    <DialogDescription>
                      Update the details for {subject.subject}.
                    </DialogDescription>
                  </DialogHeader>
                  <EditSubjectForm subject={subject} onSuccess={() => setIsDialogOpen(false)}/>
                </DialogContent>
                 <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the subject and all associated class enrollments.
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
