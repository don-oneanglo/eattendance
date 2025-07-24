
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
import { addStudent } from "@/lib/actions";
import { Loader } from "lucide-react";
import { useState } from "react";

const studentFormSchema = z.object({
  studentCode: z.string().min(1, "Student ID is required"),
  name: z.string().min(1, "Name is required"),
  nickname: z.string().optional(),
  email: z.string().email("Invalid email address"),
  campus: z.string().min(1, "Campus is required"),
  form: z.string().min(1, "Form is required"),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

export function AddStudentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      studentCode: "",
      name: "",
      nickname: "",
      email: "",
      campus: "Main",
      form: "",
    },
  });

  async function onSubmit(data: StudentFormValues) {
    setIsLoading(true);
    try {
      const result = await addStudent({
        ...data,
        nickname: data.nickname || '',
      });
      if (result.success) {
        toast({
          title: "Student Added",
          description: "The new student has been successfully added.",
        });
        // Optionally, close dialog and refresh data
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
          name="studentCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., S006" {...field} />
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
                <Input placeholder="e.g., Emily White" {...field} />
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
                <Input placeholder="e.g., Emy" {...field} />
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
                <Input placeholder="e.g., emily.w@email.com" {...field} />
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
          name="form"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Form / Grade Level</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Form 3C" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          Save Student
        </Button>
      </form>
    </Form>
  );
}
