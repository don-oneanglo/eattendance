"use server";

import { autoAttendance } from "@/ai/flows/auto-attendance";
import { authenticateTeacher } from "@/ai/flows/authenticate-teacher";
import { getStudentsForClass, getAllTeachers } from "./mock-data";

export async function runAutoAttendance(classId: string, imageDataUris: string[]) {
  try {
    const studentsInClass = await getStudentsForClass(classId);
    if (!studentsInClass || studentsInClass.length === 0) {
      throw new Error("No students found for this class.");
    }

    const studentNames = studentsInClass.map(s => s.name);
    
    // The new camera-view component will pass the captured image data URIs.
    const result = await autoAttendance({
      studentImageDataUris: imageDataUris,
      knownStudentList: studentNames,
    });

    // The AI might return slightly different names, so you might need normalization in a real app.
    // For this mock, we'll assume it returns a subset of the provided names.
    const recognizedStudent = studentsInClass.find(s => result.presentStudents.includes(s.name));

    return {
      success: true,
      presentStudents: recognizedStudent ? [recognizedStudent.name] : [],
    };

  } catch (error) {
    console.error("Error running auto-attendance:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}


export async function runTeacherAuthentication(imageDataUri: string) {
  try {
    const allTeachers = await getAllTeachers();
    if (!allTeachers || allTeachers.length === 0) {
      throw new Error("No teachers found in the system.");
    }

    const teacherNames = allTeachers.map(t => t.name);

    const result = await authenticateTeacher({
      teacherImageDataUri: imageDataUri,
      knownTeacherList: teacherNames,
    });

    if (result.teacherName) {
      const recognizedTeacher = allTeachers.find(t => t.name === result.teacherName);
      if (recognizedTeacher) {
        return {
          success: true,
          teacher: {
            id: recognizedTeacher.id,
            name: recognizedTeacher.name,
          }
        };
      }
    }

    return {
      success: false,
      error: "Face not recognized.",
    };

  } catch (error) {
    console.error("Error running teacher authentication:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred during authentication.",
    };
  }
}
