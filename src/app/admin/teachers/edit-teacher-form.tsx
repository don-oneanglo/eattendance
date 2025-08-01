
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { updateTeacher } from "@/lib/actions";
import { Loader } from "lucide-react";
import { useState } from "react";
import type { Teacher } from "@/lib/types";

const teacherFormSchema = z.object({
  teacherCode: z.string().min(1, "Teacher ID is required"),
  name: z.string().min(1, "Name is required"),
  nickname: z.string().optional(),
  email: z.string().email("Invalid email address"),
  campus: z.string().min(1, "Campus is required"),
  department: z.string().min(1, "Department is required"),
});

type TeacherFormValues = z.infer<typeof teacherFormSchema>;

type EditTeacherFormProps = {
  teacher: Teacher;
  onSuccess?: () => void;
};

export function EditTeacherForm({ teacher, onSuccess }: EditTeacherFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      teacherCode: teacher.teacherCode,
      name: teacher.name,
      nickname: teacher.nickname,
      email: teacher.email,
      campus: teacher.campus,
      department: teacher.department,
    },
  });

  async function onSubmit(data: TeacherFormValues) {
    setIsLoading(true);
    try {
      const result = await updateTeacher(teacher.id, {
        ...data,
        nickname: data.nickname || '',
      });
      if (result.success) {
        toast({
          title: "Teacher Updated",
          description: "The teacher's details have been successfully updated.",
        });
        if (onSuccess) onSuccess();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="teacherCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teacher ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., T001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g., john.d@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="campus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campus</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
