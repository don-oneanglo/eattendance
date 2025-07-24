
"use server";

import { revalidatePath } from "next/cache";
import { getConnection } from './db';
import type { Student, Teacher, SubjectSet, AppClass } from './types';
import {
  authenticateTeacher,
  AuthenticateTeacherInput,
  AuthenticateTeacherOutput,
} from "@/ai/flows/authenticate-teacher";
import {
  autoAttendance,
  AutoAttendanceInput,
  AutoAttendanceOutput,
} from "@/ai/flows/auto-attendance";
import { getAllTeachers } from "./mock-data";


// AI Flow Wrappers
export async function runTeacherAuthentication(input: AuthenticateTeacherInput): Promise<AuthenticateTeacherOutput> {
    return authenticateTeacher(input);
}

export async function runAutoAttendance(input: AutoAttendanceInput): Promise<AutoAttendanceOutput> {
    return autoAttendance(input);
}

export async function getTeachersForLogin(): Promise<Teacher[]> {
    return getAllTeachers();
}


// Student Actions
export async function addStudent(student: Omit<Student, 'id' | 'avatarUrl'>) {
    try {
        const db = await getConnection();
        await db.execute(
            `INSERT INTO Student (StudentCode, StudentNickname, StudentName, EmailAddress, Campus, Form) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [student.studentCode, student.nickname, student.name, student.email, student.campus, student.form]
        );
        revalidatePath("/admin/students");
        return { success: true };
    } catch (error: any) {
        console.error('Error adding student:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function updateStudent(id: number, student: Omit<Student, 'id' | 'avatarUrl'>) {
    try {
        const db = await getConnection();
        await db.execute(
            `UPDATE Student 
             SET StudentCode = ?, 
                 StudentNickname = ?, 
                 StudentName = ?, 
                 EmailAddress = ?, 
                 Campus = ?, 
                 Form = ?
             WHERE Id = ?`,
            [student.studentCode, student.nickname, student.name, student.email, student.campus, student.form, id]
        );
        revalidatePath("/admin/students");
        return { success: true };
    } catch (error: any) {
        console.error('Error updating student:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function deleteStudent(id: number) {
    try {
        const db = await getConnection();
        await db.execute('DELETE FROM Student WHERE Id = ?', [id]);
        revalidatePath("/admin/students");
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting student:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}


// Teacher Actions
export async function addTeacher(teacher: Omit<Teacher, 'id' | 'avatarUrl'>) {
    try {
        const db = await getConnection();
        await db.execute(
            `INSERT INTO Teacher (TeacherCode, TeacherNickname, TeacherName, EmailAddress, Campus, Department) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [teacher.teacherCode, teacher.nickname, teacher.name, teacher.email, teacher.campus, teacher.department]
        );
        revalidatePath("/admin/teachers");
        return { success: true };
    } catch (error: any)
    {
        console.error('Error adding teacher:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function updateTeacher(id: number, teacher: Omit<Teacher, 'id' | 'avatarUrl'>) {
    try {
        const db = await getConnection();
        await db.execute(
            `UPDATE Teacher 
             SET TeacherCode = ?, 
                 TeacherNickname = ?, 
                 TeacherName = ?, 
                 EmailAddress = ?, 
                 Campus = ?, 
                 Department = ?
             WHERE Id = ?`,
            [teacher.teacherCode, teacher.nickname, teacher.name, teacher.email, teacher.campus, teacher.department, id]
        );
        revalidatePath("/admin/teachers");
        return { success: true };
    } catch (error: any) {
        console.error('Error updating teacher:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function deleteTeacher(id: number) {
    try {
        const db = await getConnection();
        await db.execute('DELETE FROM Teacher WHERE Id = ?', [id]);
        revalidatePath("/admin/teachers");
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting teacher:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

// Subject Actions
export async function addSubject(subject: Omit<SubjectSet, 'id'>) {
    try {
        const db = await getConnection();
        await db.execute(
            `INSERT INTO SubjectSet (Campus, SubjectSetID, Subject, SubjectSetDescription, Credits) 
             VALUES (?, ?, ?, ?, ?)`,
            [subject.campus, subject.subjectSetId, subject.subject, subject.description, subject.credits]
        );
        revalidatePath("/admin/subjects");
        return { success: true };
    } catch (error: any) {
        console.error('Error adding subject:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function updateSubject(id: number, subject: Omit<SubjectSet, 'id'>) {
    try {
        const db = await getConnection();
        await db.execute(
            `UPDATE SubjectSet 
             SET Campus = ?, 
                 SubjectSetID = ?, 
                 Subject = ?, 
                 SubjectSetDescription = ?,
                 Credits = ?
             WHERE Id = ?`,
            [subject.campus, subject.subjectSetId, subject.subject, subject.description, subject.credits, id]
        );
        revalidatePath("/admin/subjects");
        return { success: true };
    } catch (error: any) {
        console.error('Error updating subject:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function deleteSubject(id: number) {
    try {
        const db = await getConnection();
        // You might want to handle related classes first
        await db.execute('DELETE FROM SubjectSet WHERE Id = ?', [id]);
        revalidatePath("/admin/subjects");
        revalidatePath("/admin/classes");
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting subject:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

// Class Actions
export async function updateClass(classId: string, teacherId: string, studentIds: string[]) {
     try {
        const db = await getConnection();
        const connection = await db.getConnection(); // Use a single connection for transaction
        await connection.beginTransaction();

        try {
            // Delete existing students for the class
            await connection.execute('DELETE FROM Class WHERE SubjectSetID = ?', [classId]);

            // Get campus from subject
            const [subjectRows]: any[] = await connection.execute('SELECT Campus FROM SubjectSet WHERE SubjectSetID = ?', [classId]);
            
            if (subjectRows.length === 0) {
                throw new Error("Subject not found, cannot determine campus.");
            }
            const campus = subjectRows[0].Campus;

            // Add the updated students
            for (const studentId of studentIds) {
                await connection.execute(
                    'INSERT INTO Class (Campus, SubjectSetID, TeacherCode, StudentCode) VALUES (?, ?, ?, ?)',
                    [campus, classId, teacherId, studentId]
                );
            }
            
            await connection.commit();
            connection.release();

            revalidatePath("/admin/classes");
            return { success: true };
        } catch (err) {
            await connection.rollback();
            connection.release();
            throw err; // Re-throw error after rolling back
        }
    } catch (error: any) {
        console.error('Error updating class:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}


export async function deleteClass(classId: string) {
    try {
        const db = await getConnection();
        await db.execute('DELETE FROM Class WHERE SubjectSetID = ?', [classId]);
        revalidatePath("/admin/classes");
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting class:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}
