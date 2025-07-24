

"use server";

import { revalidatePath } from "next/cache";
import { getConnection } from './db';
import type { Student, Teacher } from './types';
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

