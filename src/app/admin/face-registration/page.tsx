
import { getAllStudents, getAllTeachers } from "@/lib/mock-data";
import { FaceRegistrationClient } from "./face-registration-client";

export default async function FaceRegistrationPage() {
  const students = await getAllStudents();
  const teachers = await getAllTeachers();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Face Registration</h2>
        <p className="text-muted-foreground">
          Register face scans for students and teachers to enable facial recognition features.
        </p>
      </div>
      <FaceRegistrationClient students={students} teachers={teachers} />
    </div>
  );
}
