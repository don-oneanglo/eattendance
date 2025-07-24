

"use server";

import { revalidatePath } from "next/cache";
import { getConnection } from './db';
import type { Student, Teacher } from './types';


// Student Actions
export async function addStudent(student: Omit<Student, 'id' | 'avatarUrl'>) {
    try {
        const db = await getConnection();
        await db
            .input('studentCode', student.studentCode)
            .input('nickname', student.nickname)
            .input('name', student.name)
            .input('email', student.email)
            .input('campus', student.campus)
            .input('form', student.form)
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
            .input('id', id)
            .input('studentCode', student.studentCode)
            .input('nickname', student.nickname)
            .input('name', student.name)
            .input('email', student.email)
            .input('campus', student.campus)
            .input('form', student.form)
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
            .input('teacherCode', teacher.teacherCode)
            .input('nickname', teacher.nickname)
            .input('name', teacher.name)
            .input('email', teacher.email)
            .input('campus', teacher.campus)
            .input('department', teacher.department)
            .query(`INSERT INTO Teacher (TeacherCode, TeacherNickname, TeacherName, EmailAddress, Campus, Department) 
                    VALUES (@teacherCode, @nickname, @name, @email, @campus, @department)`);
        revalidatePath("/admin/teachers");
        return { success: true };
    } catch (error: any) {
        console.error('Error adding teacher:', error);
        return { success: false, error: error.message || "An unknown error occurred." };
    }
}

export async function updateTeacher(id: number, teacher: Omit<Teacher, 'id' | 'avatarUrl'>) {
    try {
        const db = await getConnection();
        await db
            .input('id', id)
            .input('teacherCode', teacher.teacherCode)
            .input('nickname', teacher.nickname)
            .input('name', teacher.name)
            .input('email', teacher.email)
            .input('campus', teacher.campus)
            .input('department', teacher.department)
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
