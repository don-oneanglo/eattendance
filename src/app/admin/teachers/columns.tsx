
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
import type { Teacher } from "@/lib/types"
import { EditTeacherForm } from "./edit-teacher-form"
import { deleteTeacher } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export const getColumns = (): ColumnDef<Teacher>[] => [
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
        const teacher = row.original
        return (
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={teacher.avatarUrl} alt={teacher.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{teacher.nickname.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{teacher.name}</span>
            </div>
        )
    }
  },
  {
    accessorKey: "teacherCode",
    header: "Teacher ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
    {
    accessorKey: "department",
    header: "Department",
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const teacher = row.original
      const { toast } = useToast()
      const [isDialogOpen, setIsDialogOpen] = useState(false)
      const [isAlertOpen, setIsAlertOpen] = useState(false)

      const handleDelete = async () => {
        const result = await deleteTeacher(teacher.id)
        if (result.success) {
          toast({ title: "Teacher Deleted", description: `${teacher.name} has been removed.` })
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
                    onClick={() => navigator.clipboard.writeText(teacher.teacherCode)}
                    >
                    Copy teacher ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                        <DropdownMenuItem>Edit Teacher</DropdownMenuItem>
                    </DialogTrigger>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          Delete Teacher
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
                </DropdownMenu>
                 <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Edit Teacher</DialogTitle>
                    <DialogDescription>
                        Update the details for {teacher.name}.
                    </DialogDescription>
                    </DialogHeader>
                    <EditTeacherForm teacher={teacher} onSuccess={() => setIsDialogOpen(false)} />
                </DialogContent>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the teacher record for {teacher.name}.
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
