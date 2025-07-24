
"use client";

import { useForm, Controller } from "react-hook-form";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { updateClass } from "@/lib/actions";
import { Loader, X } from "lucide-react";
import { useState } from "react";
import type { AppClass, Teacher, Student, SubjectSet } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const classFormSchema = z.object({
  teacherId: z.string().min(1, "Teacher is required"),
  studentIds: z.array(z.string()).min(1, "At least one student is required"),
});

type ClassFormValues = z.infer<typeof classFormSchema>;

type EditClassFormProps = {
  classData: AppClass;
  teachers: Teacher[];
  students: Student[];
  onSuccess?: () => void;
};

export function EditClassForm({ classData, teachers, students, onSuccess }: EditClassFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      teacherId: classData.teacherId,
      studentIds: classData.studentIds,
    },
  });

  async function onSubmit(data: ClassFormValues) {
    setIsLoading(true);
    try {
      const result = await updateClass(classData.id, data.teacherId, data.studentIds);
      if (result.success) {
        toast({
          title: "Class Updated",
          description: "The class has been successfully updated.",
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

  const selectedStudents = form.watch("studentIds") || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
            <h3 className="text-lg font-medium">{classData.name}</h3>
            <p className="text-sm text-muted-foreground">Class ID: {classData.id}</p>
        </div>

        <FormField
          control={form.control}
          name="teacherId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teacher</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {teachers.map(teacher => (
                        <SelectItem key={teacher.teacherCode} value={teacher.teacherCode}>
                        {teacher.name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="studentIds"
          render={() => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Students</FormLabel>
                <span className="text-sm text-muted-foreground">
                    {selectedStudents.length} of {students.length} selected
                </span>
              </div>
              <ScrollArea className="h-72 w-full rounded-md border">
                <div className="p-4">
                  {students.map((student) => (
                    <FormField
                      key={student.id}
                      control={form.control}
                      name="studentIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={student.id}
                            className="flex flex-row items-center space-x-3 space-y-0 py-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(student.studentCode)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, student.studentCode])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== student.studentCode
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal w-full cursor-pointer">
                              {student.name} ({student.studentCode})
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>
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
