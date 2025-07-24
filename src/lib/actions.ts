
"use server";

import { revalidatePath } from "next/cache";
import { getConnection, sql } from './db';
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
    redirect('/dashboard');
}

export async function getTeacherFromSession(): Promise<Teacher | null> {
    const teacherId = cookies().get(SESSION_COOKIE_NAME)?.value;
    if (!teacherId) {
        return null;
    }
    const pool = await getConnection();
    const result = await pool.request()
        .input('TeacherCode', sql.NVarChar, teacherId)
        .query('SELECT * FROM Teacher WHERE TeacherCode = @TeacherCode');

    const teacher = result.recordset[0];
    if (!teacher) return null;
     return {
        id: teacher.Id,
        teacherCode: teacher.TeacherCode,
        nickname: teacher.TeacherNickname,
        name: teacher.TeacherName,
        avatarUrl: `https://placehold.co/100x100.png`, 
        email: teacher.EmailAddress,
        campus: teacher.Campus,
        department: teacher.Department,
  };
}

export async function deleteSession() {
    cookies().delete(SESSION_COOKIE_NAME);
    redirect('/');
}

// AI Flow Wrappers
export async function runTeacherAuthentication(input: AuthenticateTeacherInput): Promise<AuthenticateTeacherOutput> {
    const result = await authenticateTeacher(input);
    return result;
}

export async function handleSuccessfulAuthentication(teacherCode: string) {
    await createSession(teacherCode);
}

export async function runAutoAttendance(input: AutoAttendanceInput): Promise<AutoAttendanceOutput> {
    return autoAttendance(input);
}


// Student Actions
export async function addStudent(student: Omit<Student, 'id' | 'avatarUrl'>) {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('StudentCode', sql.NVarChar, student.studentCode)
            .input('StudentNickname', sql.NVarChar, student.nickname)
            .input('StudentName', sql.NVarChar, student.name)
            .input('EmailAddress', sql.NVarChar, student.email)
            .input('Campus', sql.NVarChar, student.campus)
            .input('Form', sql.NVarChar, student.form)
            .query(`INSERT INTO Student (StudentCode, StudentNickname, StudentName, EmailAddress, Campus, Form) 
                    VALUES (@StudentCode, @StudentNickname, @StudentName, @EmailAddress, @Campus, @Form)`);
        revalidatePath("/admin/students");
        return { success: true };
    } catch (error: any) {
        console.error('Error adding student:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function updateStudent(id: number, student: Omit<Student, 'id' | 'avatarUrl'>) {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('Id', sql.Int, id)
            .input('StudentCode', sql.NVarChar, student.studentCode)
            .input('StudentNickname', sql.NVarChar, student.nickname)
            .input('StudentName', sql.NVarChar, student.name)
            .input('EmailAddress', sql.NVarChar, student.email)
            .input('Campus', sql.NVarChar, student.campus)
            .input('Form', sql.NVarChar, student.form)
            .query(`UPDATE Student 
                    SET StudentCode = @StudentCode, 
                        StudentNickname = @StudentNickname, 
                        StudentName = @StudentName, 
                        EmailAddress = @EmailAddress, 
                        Campus = @Campus, 
                        Form = @Form
                    WHERE Id = @Id`);
        revalidatePath("/admin/students");
        return { success: true };
    } catch (error: any) {
        console.error('Error updating student:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function deleteStudent(id: number) {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('Id', sql.Int, id)
            .query('DELETE FROM Student WHERE Id = @Id');
        revalidatePath("/admin/students");
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting student:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function importStudents(students: Omit<Student, 'id' | 'avatarUrl'>[]) {
    try {
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
        try {
            const query = `
                MERGE INTO Student AS Target
                USING (SELECT @StudentCode AS StudentCode) AS Source
                ON Target.StudentCode = Source.StudentCode
                WHEN MATCHED THEN
                    UPDATE SET 
                        StudentName = @StudentName, 
                        StudentNickname = @StudentNickname, 
                        EmailAddress = @EmailAddress, 
                        Campus = @Campus, 
                        Form = @Form
                WHEN NOT MATCHED THEN
                    INSERT (StudentCode, StudentName, StudentNickname, EmailAddress, Campus, Form)
                    VALUES (@StudentCode, @StudentName, @StudentNickname, @EmailAddress, @Campus, @Form);
            `;
            const request = new sql.Request(transaction);
            for (const student of students) {
                await request
                    .input('StudentCode', sql.NVarChar, student.studentCode)
                    .input('StudentName', sql.NVarChar, student.name)
                    .input('StudentNickname', sql.NVarChar, student.nickname)
                    .input('EmailAddress', sql.NVarChar, student.email)
                    .input('Campus', sql.NVarChar, student.campus)
                    .input('Form', sql.NVarChar, student.form)
                    .query(query);
            }
            await transaction.commit();
            revalidatePath("/admin/students");
            return { success: true, count: students.length };
        } catch (err) {
            await transaction.rollback();
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
        const pool = await getConnection();
        await pool.request()
            .input('TeacherCode', sql.NVarChar, teacher.teacherCode)
            .input('TeacherNickname', sql.NVarChar, teacher.nickname)
            .input('TeacherName', sql.NVarChar, teacher.name)
            .input('EmailAddress', sql.NVarChar, teacher.email)
            .input('Campus', sql.NVarChar, teacher.campus)
            .input('Department', sql.NVarChar, teacher.department)
            .query(`INSERT INTO Teacher (TeacherCode, TeacherNickname, TeacherName, EmailAddress, Campus, Department) 
                    VALUES (@TeacherCode, @TeacherNickname, @TeacherName, @EmailAddress, @Campus, @Department)`);
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
        const pool = await getConnection();
        await pool.request()
            .input('Id', sql.Int, id)
            .input('TeacherCode', sql.NVarChar, teacher.teacherCode)
            .input('TeacherNickname', sql.NVarChar, teacher.nickname)
            .input('TeacherName', sql.NVarChar, teacher.name)
            .input('EmailAddress', sql.NVarChar, teacher.email)
            .input('Campus', sql.NVarChar, teacher.campus)
            .input('Department', sql.NVarChar, teacher.department)
            .query(`UPDATE Teacher 
                    SET TeacherCode = @TeacherCode, 
                        TeacherNickname = @TeacherNickname, 
                        TeacherName = @TeacherName, 
                        EmailAddress = @EmailAddress, 
                        Campus = @Campus, 
                        Department = @Department
                    WHERE Id = @Id`);
        revalidatePath("/admin/teachers");
        return { success: true };
    } catch (error: any) {
        console.error('Error updating teacher:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function deleteTeacher(id: number) {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('Id', sql.Int, id)
            .query('DELETE FROM Teacher WHERE Id = @Id');
        revalidatePath("/admin/teachers");
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting teacher:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function importTeachers(teachers: Omit<Teacher, 'id' | 'avatarUrl'>[]) {
    try {
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
        try {
            const query = `
                MERGE INTO Teacher AS Target
                USING (SELECT @TeacherCode AS TeacherCode) AS Source
                ON Target.TeacherCode = Source.TeacherCode
                WHEN MATCHED THEN
                    UPDATE SET 
                        TeacherName = @TeacherName, 
                        TeacherNickname = @TeacherNickname, 
                        EmailAddress = @EmailAddress, 
                        Campus = @Campus, 
                        Department = @Department
                WHEN NOT MATCHED THEN
                    INSERT (TeacherCode, TeacherName, TeacherNickname, EmailAddress, Campus, Department)
                    VALUES (@TeacherCode, @TeacherName, @TeacherNickname, @EmailAddress, @Campus, @Department);
            `;
            const request = new sql.Request(transaction);
            for (const teacher of teachers) {
                await request
                    .input('TeacherCode', sql.NVarChar, teacher.teacherCode)
                    .input('TeacherName', sql.NVarChar, teacher.name)
                    .input('TeacherNickname', sql.NVarChar, teacher.nickname)
                    .input('EmailAddress', sql.NVarChar, teacher.email)
                    .input('Campus', sql.NVarChar, teacher.campus)
                    .input('Department', sql.NVarChar, teacher.department)
                    .query(query);
            }
            await transaction.commit();
            revalidatePath("/admin/teachers");
            return { success: true, count: teachers.length };
        } catch (err) {
            await transaction.rollback();
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
        const pool = await getConnection();
        await pool.request()
            .input('Campus', sql.NVarChar, subject.campus)
            .input('SubjectSetID', sql.NVarChar, subject.subjectSetId)
            .input('Subject', sql.NVarChar, subject.subject)
            .input('SubjectSetDescription', sql.NVarChar, subject.description)
            .input('Credits', sql.Int, subject.credits)
            .query(`INSERT INTO SubjectSet (Campus, SubjectSetID, Subject, SubjectSetDescription, Credits) 
                    VALUES (@Campus, @SubjectSetID, @Subject, @SubjectSetDescription, @Credits)`);
        revalidatePath("/admin/subjects");
        return { success: true };
    } catch (error: any) {
        console.error('Error adding subject:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function updateSubject(id: number, subject: Omit<SubjectSet, 'id'>) {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('Id', sql.Int, id)
            .input('Campus', sql.NVarChar, subject.campus)
            .input('SubjectSetID', sql.NVarChar, subject.subjectSetId)
            .input('Subject', sql.NVarChar, subject.subject)
            .input('SubjectSetDescription', sql.NVarChar, subject.description)
            .input('Credits', sql.Int, subject.credits)
            .query(`UPDATE SubjectSet 
                    SET Campus = @Campus, 
                        SubjectSetID = @SubjectSetID, 
                        Subject = @Subject, 
                        SubjectSetDescription = @SubjectSetDescription,
                        Credits = @Credits
                    WHERE Id = @Id`);
        revalidatePath("/admin/subjects");
        return { success: true };
    } catch (error: any) {
        console.error('Error updating subject:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function deleteSubject(id: number) {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('Id', sql.Int, id)
            .query('DELETE FROM SubjectSet WHERE Id = @Id');
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
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
        try {
            const query = `
                MERGE INTO SubjectSet AS Target
                USING (SELECT @SubjectSetID AS SubjectSetID) AS Source
                ON Target.SubjectSetID = Source.SubjectSetID
                WHEN MATCHED THEN
                    UPDATE SET
                        Subject = @Subject,
                        SubjectSetDescription = @Description,
                        Campus = @Campus,
                        Credits = @Credits
                WHEN NOT MATCHED THEN
                    INSERT (SubjectSetID, Subject, SubjectSetDescription, Campus, Credits)
                    VALUES (@SubjectSetID, @Subject, @Description, @Campus, @Credits);
            `;
            const request = new sql.Request(transaction);
            for (const subject of subjects) {
                await request
                    .input('SubjectSetID', sql.NVarChar, subject.subjectSetId)
                    .input('Subject', sql.NVarChar, subject.subject)
                    .input('Description', sql.NVarChar, subject.description)
                    .input('Campus', sql.NVarChar, subject.campus)
                    .input('Credits', sql.Int, subject.credits)
                    .query(query);
            }
            await transaction.commit();
            revalidatePath("/admin/subjects");
            return { success: true, count: subjects.length };
        } catch (err) {
            await transaction.rollback();
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
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Delete existing students for the class
            const deleteRequest = new sql.Request(transaction);
            await deleteRequest
                .input('SubjectSetID', sql.NVarChar, classId)
                .query('DELETE FROM Class WHERE SubjectSetID = @SubjectSetID');

            // Get campus from subject
            const subjectRequest = new sql.Request(transaction);
            const subjectResult = await subjectRequest
                .input('SubjectSetID', sql.NVarChar, classId)
                .query('SELECT Campus FROM SubjectSet WHERE SubjectSetID = @SubjectSetID');
            
            if (subjectResult.recordset.length === 0) {
                throw new Error("Subject not found, cannot determine campus.");
            }
            const campus = subjectResult.recordset[0].Campus;

            // Add the updated students
            const insertRequest = new sql.Request(transaction);
            for (const studentId of studentIds) {
                await insertRequest
                    .input('Campus', sql.NVarChar, campus)
                    .input('SubjectSetID', sql.NVarChar, classId)
                    .input('TeacherCode', sql.NVarChar, teacherId)
                    .input('StudentCode', sql.NVarChar, studentId)
                    .query('INSERT INTO Class (Campus, SubjectSetID, TeacherCode, StudentCode) VALUES (@Campus, @SubjectSetID, @TeacherCode, @StudentCode)');
            }
            
            await transaction.commit();

            revalidatePath("/admin/classes");
            return { success: true };
        } catch (err) {
            await transaction.rollback();
            throw err; // Re-throw error after rolling back
        }
    } catch (error: any) {
        console.error('Error updating class:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}


export async function deleteClass(classId: string) {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('SubjectSetID', sql.NVarChar, classId)
            .query('DELETE FROM Class WHERE SubjectSetID = @SubjectSetID');
        revalidatePath("/admin/classes");
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting class:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function importClasses(classes: { SubjectSetID: string, TeacherCode: string, StudentCode: string, Campus: string }[]) {
    try {
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
        try {
            // It's safer to delete all existing enrollments for the subjects being imported
            // to avoid leaving orphaned records.
            const subjectSetIDs = [...new Set(classes.map(c => c.SubjectSetID))];
            if (subjectSetIDs.length > 0) {
                 const deleteRequest = new sql.Request(transaction);
                 // mssql doesn't support array binding directly, need to create parameter list
                 const subjectParams = subjectSetIDs.map((_, i) => `@subjectId${i}`).join(',');
                 subjectSetIDs.forEach((id, i) => {
                     deleteRequest.input(`subjectId${i}`, sql.NVarChar, id);
                 });
                 await deleteRequest.query(`DELETE FROM Class WHERE SubjectSetID IN (${subjectParams})`);
            }

            const query = `
                INSERT INTO Class (Campus, SubjectSetID, TeacherCode, StudentCode)
                VALUES (@Campus, @SubjectSetID, @TeacherCode, @StudentCode)
            `;
            const request = new sql.Request(transaction);
            for (const cls of classes) {
                await request
                    .input('Campus', sql.NVarChar, cls.Campus)
                    .input('SubjectSetID', sql.NVarChar, cls.SubjectSetID)
                    .input('TeacherCode', sql.NVarChar, cls.TeacherCode)
                    .input('StudentCode', sql.NVarChar, cls.StudentCode)
                    .query(query);
            }
            await transaction.commit();
            revalidatePath("/admin/classes");
            return { success: true, count: classes.length };
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (error: any) {
        console.error('Error importing classes:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}
