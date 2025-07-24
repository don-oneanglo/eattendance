
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
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

export const columns: ColumnDef<Teacher>[] = [
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
    cell: ({ row }) => {
      const teacher = row.original

      return (
        <div className="text-right">
             <Dialog>
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
                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        Delete Teacher
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
                 <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Edit Teacher</DialogTitle>
                    <DialogDescription>
                        Update the details for {teacher.name}.
                    </DialogDescription>
                    </DialogHeader>
                    <EditTeacherForm teacher={teacher} />
                </DialogContent>
            </Dialog>
        </div>
      )
    },
  },
]
