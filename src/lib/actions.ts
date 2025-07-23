"use server";

import { autoAttendance } from "@/ai/flows/auto-attendance";
import { getStudentsForClass } from "./mock-data";

// This is a simplified image-to-data-URI converter for demonstration.
// In a real app, you'd fetch the image and convert it properly.
const toDataURI = (url: string) => {
  // Since we use placehold.co, the URL is predictable. We can create a fake base64 string.
  // This avoids needing to actually fetch the image on the server.
  const base64 = Buffer.from(`mock-image-for-${url}`).toString('base64');
  return `data:image/png;base64,${base64}`;
}

export async function runAutoAttendance(classId: string) {
  try {
    const studentsInClass = getStudentsForClass(classId);
    if (!studentsInClass || studentsInClass.length === 0) {
      throw new Error("No students found for this class.");
    }

    const studentNames = studentsInClass.map(s => s.name);
    
    // In a real application, you would capture live images from the camera.
    // For this simulation, we're using the students' avatar URLs as if they were captured images.
    const studentImageDataUris = studentsInClass.map(s => toDataURI(s.avatarUrl));

    // To make the AI's job non-trivial, let's pretend one student is absent.
    const presentStudentUris = studentImageDataUris.slice(0, -1);
    
    const result = await autoAttendance({
      studentImageDataUris: presentStudentUris,
      knownStudentList: studentNames,
    });

    // The AI might return slightly different names, so we should normalize.
    // For this mock, we'll assume it returns the exact names of the students whose images we sent.
    const presentMockNames = studentsInClass.slice(0, -1).map(s => s.name);

    return {
      success: true,
      presentStudents: result.presentStudents.length > 0 ? result.presentStudents : presentMockNames, // Fallback for mock
    };

  } catch (error) {
    console.error("Error running auto-attendance:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}
