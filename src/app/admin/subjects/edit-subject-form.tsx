
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateSubject } from "@/lib/actions";
import { Loader } from "lucide-react";
import { useState } from "react";
import type { SubjectSet } from "@/lib/types";

const subjectFormSchema = z.object({
  subjectSetId: z.string().min(1, "Subject ID is required"),
  subject: z.string().min(1, "Subject name is required"),
  description: z.string().min(1, "Description is required"),
  campus: z.string().min(1, "Campus is required"),
  credits: z.coerce.number().min(0, "Credits must be a positive number"),
});

type SubjectFormValues = z.infer<typeof subjectFormSchema>;

type EditSubjectFormProps = {
  subject: SubjectSet;
  onSuccess?: () => void;
};

export function EditSubjectForm({ subject, onSuccess }: EditSubjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      subjectSetId: subject.subjectSetId,
      subject: subject.subject,
      description: subject.description,
      campus: subject.campus,
      credits: subject.credits,
    },
  });

  async function onSubmit(data: SubjectFormValues) {
    setIsLoading(true);
    try {
      const result = await updateSubject(subject.id, data);
      if (result.success) {
        toast({
          title: "Subject Updated",
          description: "The subject has been successfully updated.",
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
          name="subjectSetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., CS101" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Introduction to Computer Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the subject..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="credits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credits</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
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
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
