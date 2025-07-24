
"use server";

import { revalidatePath } from "next/cache";
import { getConnection } from './db';
import type { Student, Teacher, SubjectSet, AppClass } from './types';
import sql from 'mssql';


// Student Actions
export async function addStudent(student: Omit<Student, 'id' | 'avatarUrl'>) {
    try {
        const db = await getConnection();
        await db
            .input('studentCode', sql.NVarChar, student.studentCode)
            .input('nickname', sql.NVarChar, student.nickname)
            .input('name', sql.NVarChar, student.name)
            .input('email', sql.NVarChar, student.email)
            .input('campus', sql.NVarChar, student.campus)
            .input('form', sql.NVarChar, student.form)
            .query(`INSERT INTO Student (StudentCode, StudentNickname, StudentName, EmailAddress, Campus, Form) 
                    VALUES (@studentCode, @nickname, @name, @email, @campus, @form)`);
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
        await db
            .input('id', sql.Int, id)
            .input('studentCode', sql.NVarChar, student.studentCode)
            .input('nickname', sql.NVarChar, student.nickname)
            .input('name', sql.NVarChar, student.name)
            .input('email', sql.NVarChar, student.email)
            .input('campus', sql.NVarChar, student.campus)
            .input('form', sql.NVarChar, student.form)
            .query(`UPDATE Student 
                    SET StudentCode = @studentCode, 
                        StudentNickname = @nickname, 
                        StudentName = @name, 
                        EmailAddress = @email, 
                        Campus = @campus, 
                        Form = @form
                    WHERE Id = @id`);
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
        await db.input('id', sql.Int, id).query('DELETE FROM Student WHERE Id = @id');
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
        await db
            .input('teacherCode', sql.NVarChar, teacher.teacherCode)
            .input('nickname', sql.NVarChar, teacher.nickname)
            .input('name', sql.NVarChar, teacher.name)
            .input('email', sql.NVarChar, teacher.email)
            .input('campus', sql.NVarChar, teacher.campus)
            .input('department', sql.NVarChar, teacher.department)
            .query(`INSERT INTO Teacher (TeacherCode, TeacherNickname, TeacherName, EmailAddress, Campus, Department) 
                    VALUES (@teacherCode, @nickname, @name, @email, @campus, @department)`);
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
        await db
            .input('id', sql.Int, id)
            .input('teacherCode', sql.NVarChar, teacher.teacherCode)
            .input('nickname', sql.NVarChar, teacher.nickname)
            .input('name', sql.NVarChar, teacher.name)
            .input('email', sql.NVarChar, teacher.email)
            .input('campus', sql.NVarChar, teacher.campus)
            .input('department', sql.NVarChar, teacher.department)
            .query(`UPDATE Teacher 
                    SET TeacherCode = @teacherCode, 
                        TeacherNickname = @nickname, 
                        TeacherName = @name, 
                        EmailAddress = @email, 
                        Campus = @campus, 
                        Department = @department
                    WHERE Id = @id`);
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
        await db.input('id', sql.Int, id).query('DELETE FROM Teacher WHERE Id = @id');
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
        await db
            .input('campus', sql.NVarChar, subject.campus)
            .input('subjectSetId', sql.NVarChar, subject.subjectSetId)
            .input('subject', sql.NVarChar, subject.subject)
            .input('description', sql.NVarChar, subject.description)
            .input('credits', sql.Int, subject.credits)
            .query(`INSERT INTO SubjectSet (Campus, SubjectSetID, Subject, SubjectSetDescription, Credits) 
                    VALUES (@campus, @subjectSetId, @subject, @description, @credits)`);
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
        await db
            .input('id', sql.Int, id)
            .input('campus', sql.NVarChar, subject.campus)
            .input('subjectSetId', sql.NVarChar, subject.subjectSetId)
            .input('subject', sql.NVarChar, subject.subject)
            .input('description', sql.NVarChar, subject.description)
            .input('credits', sql.Int, subject.credits)
            .query(`UPDATE SubjectSet 
                    SET Campus = @campus, 
                        SubjectSetID = @subjectSetId, 
                        Subject = @subject, 
                        SubjectSetDescription = @description,
                        Credits = @credits
                    WHERE Id = @id`);
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
        await db.input('id', sql.Int, id).query('DELETE FROM SubjectSet WHERE Id = @id');
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
        const transaction = new sql.Transaction(db);
        await transaction.begin();

        try {
            // Delete existing students for the class
            const deleteRequest = new sql.Request(transaction);
            await deleteRequest
                .input('subjectSetId', sql.NVarChar, classId)
                .query('DELETE FROM Class WHERE SubjectSetID = @subjectSetId');

            // Get campus from subject
            const subjectRequest = new sql.Request(transaction);
            const subjectResult = await subjectRequest
                .input('subjectSetId', sql.NVarChar, classId)
                .query('SELECT Campus FROM SubjectSet WHERE SubjectSetID = @subjectSetId');
            
            if (subjectResult.recordset.length === 0) {
                throw new Error("Subject not found, cannot determine campus.");
            }
            const campus = subjectResult.recordset[0].Campus;

            // Add the updated students
            for (const studentId of studentIds) {
                const insertRequest = new sql.Request(transaction);
                await insertRequest
                    .input('campus', sql.NVarChar, campus)
                    .input('subjectSetId', sql.NVarChar, classId)
                    .input('teacherCode', sql.NVarChar, teacherId)
                    .input('studentCode', sql.NVarChar, studentId)
                    .query('INSERT INTO Class (Campus, SubjectSetID, TeacherCode, StudentCode) VALUES (@campus, @subjectSetId, @teacherCode, @studentCode)');
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
        const db = await getConnection();
        await db.input('subjectSetId', sql.NVarChar, classId).query('DELETE FROM Class WHERE SubjectSetID = @subjectSetId');
        revalidatePath("/admin/classes");
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting class:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}
