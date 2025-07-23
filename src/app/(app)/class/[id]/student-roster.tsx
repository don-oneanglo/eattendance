"use client";

import { useState } from "react";
import type { StudentWithStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScanFace, FileDown, Loader, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { runAutoAttendance } from "@/lib/actions";
import { exportToCsv } from "@/lib/utils";

type StudentRosterProps = {
  initialRoster: StudentWithStatus[];
  classId: string;
};

export function StudentRoster({ initialRoster, classId }: StudentRosterProps) {
  const [roster, setRoster] = useState<StudentWithStatus[]>(initialRoster);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = (studentId: string, isPresent: boolean) => {
    setRoster(prevRoster =>
      prevRoster.map(student =>
        student.id === studentId ? { ...student, status: isPresent ? "present" : "absent" } : student
      )
    );
  };

  const handleAutoAttend = async () => {
    setIsLoading(true);
    const result = await runAutoAttendance(classId);
    setIsLoading(false);

    if (result.success && result.presentStudents) {
      const presentNames = result.presentStudents;
      setRoster(prevRoster =>
        prevRoster.map(student =>
          presentNames.includes(student.name) ? { ...student, status: "present" } : student
        )
      );
      toast({
        title: "Attendance Updated",
        description: `${presentNames.length} students marked as present.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Could not complete auto-attendance.",
        variant: "destructive",
      });
    }
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
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-end gap-2 mb-4">
          <Button onClick={handleAutoAttend} disabled={isLoading}>
            {isLoading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Auto-Attendance
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
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
