"use client";

import { useState } from "react";
import type { StudentWithStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FileDown, Check, X, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToCsv } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

type StudentRosterProps = {
  initialRoster: StudentWithStatus[];
  classId: string;
};

export function StudentRoster({ initialRoster, classId }: StudentRosterProps) {
  const [roster, setRoster] = useState<StudentWithStatus[]>(initialRoster.map(s => ({...s, remarks: ''})));
  const { toast } = useToast();

  const handleStatusChange = (studentId: number, status: StudentWithStatus['status']) => {
    setRoster(prevRoster =>
      prevRoster.map(student =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };
  
  const handleRemarkChange = (studentId: number, remarks: string) => {
    setRoster(prevRoster =>
      prevRoster.map(student =>
        student.id === studentId ? { ...student, remarks } : student
      )
    );
  };

  const handleExport = () => {
    const dataToExport = roster.map(({ studentCode, name, status, remarks }) => ({
      student_id: studentCode,
      student_name: name,
      attendance_status: status,
      remarks,
    }));
    exportToCsv(`attendance-report-${classId}-${new Date().toISOString().split('T')[0]}.csv`, dataToExport);
    toast({ title: "Export Started", description: "Your CSV report is downloading." });
  };

  const getStatusBadge = (status: StudentWithStatus['status']) => {
    switch (status) {
      case "present":
        return <Badge variant="default" className="bg-success text-success-foreground">Present</Badge>;
      case "absent":
        return <Badge variant="destructive">Absent</Badge>;
      case "late":
        return <Badge variant="default" className="bg-warning text-warning-foreground">Late</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="flex-1 flex flex-col">
      <CardContent className="pt-6 flex-1 flex flex-col gap-4">
        <Alert variant="destructive" className="bg-yellow-100 border-yellow-300 text-yellow-800 [&>svg]:text-yellow-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-bold">
            **If a student is present in school, but missing in class for more than 10 minutes, please report to the Thai Director immediately**
          </AlertDescription>
        </Alert>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
        <div className="border rounded-lg flex-1 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-secondary">
              <TableRow>
                <TableHead className="w-[40%]">STUDENT LIST</TableHead>
                <TableHead className="text-center">OPTIONS</TableHead>
                <TableHead className="text-center">STATUS</TableHead>
                <TableHead className="text-center w-[25%]">REMARKS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roster.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <span>{index + 1}.</span>
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{student.nickname.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{student.name} ({student.form})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                         <Button size="icon" className="bg-success text-success-foreground hover:bg-success/90 w-10 h-10" onClick={() => handleStatusChange(student.id, 'present')}>
                            <Check />
                         </Button>
                         <Button size="icon" variant="destructive" className="w-10 h-10" onClick={() => handleStatusChange(student.id, 'absent')}>
                            <X />
                         </Button>
                         <Button size="icon" className="bg-warning text-warning-foreground hover:bg-warning/90 w-10 h-10" onClick={() => handleStatusChange(student.id, 'late')}>
                            <span className="font-bold text-lg">L</span>
                         </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(student.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Textarea 
                      value={student.remarks}
                      onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                      placeholder="Add remarks..."
                      className="min-h-[40px]"
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
