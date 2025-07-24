
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
import { getAllTeachers, getTeacher } from "./mock-data";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


// Session Actions
const SESSION_COOKIE_NAME = 'session_teacher_id';

export async function createSession(teacherId: string) {
    cookies().set(SESSION_COOKIE_NAME, teacherId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
    });
}

export async function getTeacherFromSession(): Promise<Teacher | null> {
    const teacherId = cookies().get(SESSION_COOKIE_NAME)?.value;
    if (!teacherId) {
        return null;
    }
    const teacher = await getTeacher(teacherId);
    return teacher || null;
}

export async function deleteSession() {
    cookies().delete(SESSION_COOKIE_NAME);
    redirect('/');
}

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

export async function importStudents(students: Omit<Student, 'id' | 'avatarUrl'>[]) {
    try {
        const db = await getConnection();
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            const query = `
                INSERT INTO Student (StudentCode, StudentName, StudentNickname, EmailAddress, Campus, Form) 
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                StudentName = VALUES(StudentName), 
                StudentNickname = VALUES(StudentNickname), 
                EmailAddress = VALUES(EmailAddress), 
                Campus = VALUES(Campus), 
                Form = VALUES(Form)
            `;
            for (const student of students) {
                await connection.execute(query, [
                    student.studentCode,
                    student.name,
                    student.nickname,
                    student.email,
                    student.campus,
                    student.form,
                ]);
            }
            await connection.commit();
            connection.release();
            revalidatePath("/admin/students");
            return { success: true, count: students.length };
        } catch (err) {
            await connection.rollback();
            connection.release();
            throw err;
        }
    } catch (error: any) {
        console.error('Error importing students:', error);
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

export async function importTeachers(teachers: Omit<Teacher, 'id' | 'avatarUrl'>[]) {
    try {
        const db = await getConnection();
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            const query = `
                INSERT INTO Teacher (TeacherCode, TeacherName, TeacherNickname, EmailAddress, Campus, Department) 
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                TeacherName = VALUES(TeacherName), 
                TeacherNickname = VALUES(TeacherNickname), 
                EmailAddress = VALUES(EmailAddress), 
                Campus = VALUES(Campus), 
                Department = VALUES(Department)
            `;
            for (const teacher of teachers) {
                await connection.execute(query, [
                    teacher.teacherCode,
                    teacher.name,
                    teacher.nickname,
                    teacher.email,
                    teacher.campus,
                    teacher.department,
                ]);
            }
            await connection.commit();
            connection.release();
            revalidatePath("/admin/teachers");
            return { success: true, count: teachers.length };
        } catch (err) {
            await connection.rollback();
            connection.release();
            throw err;
        }
    } catch (error: any) {
        console.error('Error importing teachers:', error);
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

export async function importSubjects(subjects: Omit<SubjectSet, 'id'>[]) {
    try {
        const db = await getConnection();
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            const query = `
                INSERT INTO SubjectSet (SubjectSetID, Subject, SubjectSetDescription, Campus, Credits)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                Subject = VALUES(Subject),
                SubjectSetDescription = VALUES(SubjectSetDescription),
                Campus = VALUES(Campus),
                Credits = VALUES(Credits)
            `;
            for (const subject of subjects) {
                await connection.execute(query, [
                    subject.subjectSetId,
                    subject.subject,
                    subject.description,
                    subject.campus,
                    subject.credits,
                ]);
            }
            await connection.commit();
            connection.release();
            revalidatePath("/admin/subjects");
            return { success: true, count: subjects.length };
        } catch (err) {
            await connection.rollback();
            connection.release();
            throw err;
        }
    } catch (error: any) {
        console.error('Error importing subjects:', error);
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

export async function importClasses(classes: { SubjectSetID: string, TeacherCode: string, StudentCode: string, Campus: string }[]) {
    try {
        const db = await getConnection();
        const connection = await db.getConnection();
        await connection.beginTransaction();
        try {
            // It's safer to delete all existing enrollments for the subjects being imported
            // to avoid leaving orphaned records.
            const subjectSetIDs = [...new Set(classes.map(c => c.SubjectSetID))];
            if (subjectSetIDs.length > 0) {
                 const placeholders = subjectSetIDs.map(() => '?').join(',');
                 await connection.execute(`DELETE FROM Class WHERE SubjectSetID IN (${placeholders})`, subjectSetIDs);
            }

            const query = `
                INSERT INTO Class (Campus, SubjectSetID, TeacherCode, StudentCode)
                VALUES (?, ?, ?, ?)
            `;
            for (const cls of classes) {
                await connection.execute(query, [
                    cls.Campus,
                    cls.SubjectSetID,
                    cls.TeacherCode,
                    cls.StudentCode,
                ]);
            }
            await connection.commit();
            connection.release();
            revalidatePath("/admin/classes");
            return { success: true, count: classes.length };
        } catch (err) {
            await connection.rollback();
            connection.release();
            throw err;
        }
    } catch (error: any) {
        console.error('Error importing classes:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}
