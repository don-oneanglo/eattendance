"use client";

import { useState } from "react";
import type { StudentWithStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { FileDown, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToCsv } from "@/lib/utils";

type StudentRosterProps = {
  initialRoster: StudentWithStatus[];
  classId: string;
};

export function StudentRoster({ initialRoster, classId }: StudentRosterProps) {
  const [roster, setRoster] = useState<StudentWithStatus[]>(initialRoster);
  const { toast } = useToast();

  const handleStatusChange = (studentId: string, isPresent: boolean) => {
    setRoster(prevRoster =>
      prevRoster.map(student =>
        student.id === studentId ? { ...student, status: isPresent ? "present" : "absent" } : student
      )
    );
  };

  const handleExport = () => {
    const dataToExport = roster.map(({ id, name, status }) => ({
      student_id: id,
      student_name: name,
      attendance_status: status,
    }));
    exportToCsv(`attendance-report-${classId}-${new Date().toISOString().split('T')[0]}.csv`, dataToExport);
    toast({ title: "Export Started", description: "Your CSV report is downloading." });
  };

  const getStatusBadge = (status: StudentWithStatus['status']) => {
    switch (status) {
      case "present":
        return <Badge variant="default" className="bg-accent text-accent-foreground">Present</Badge>;
      case "absent":
        return <Badge variant="secondary">Absent</Badge>;
      case "late":
        return <Badge variant="destructive">Late</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="flex-1 flex flex-col">
      <CardContent className="pt-6 flex-1 flex flex-col">
        <div className="flex justify-end gap-2 mb-4">
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
        <div className="border rounded-lg flex-1 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Mark Present</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roster.map(student => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(student.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={student.status === "present"}
                      onCheckedChange={(checked) => handleStatusChange(student.id, checked)}
                      aria-label={`Mark ${student.name} as present or absent`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
