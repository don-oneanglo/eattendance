import type { Student, Teacher, SubjectSet, AppClass, Session } from './types';
import { getConnection } from './db';

// Helper functions to query live database
export async function getTeacher(teacherId: string): Promise<Teacher | undefined> {
  const db = await getConnection();
  const result = await db.input('teacherCode', teacherId).query('SELECT * FROM Teacher WHERE TeacherCode = @teacherCode');
  const teacher = result.recordset[0];
  if (!teacher) return undefined;
  return {
    id: teacher.Id,
    teacherCode: teacher.TeacherCode,
    nickname: teacher.TeacherNickname,
    name: teacher.TeacherName,
    avatarUrl: `https://placehold.co/100x100.png`, // Assuming avatarUrl is not in DB
    email: teacher.EmailAddress,
    campus: teacher.Campus,
    department: teacher.Department,
  };
}

export async function getAllTeachers(): Promise<Teacher[]> {
  const db = await getConnection();
  const result = await db.query('SELECT * FROM Teacher');
  return result.recordset.map((teacher: any) => ({
    id: teacher.Id,
    teacherCode: teacher.TeacherCode,
    nickname: teacher.TeacherNickname,
    name: teacher.TeacherName,
    avatarUrl: `https://placehold.co/100x100.png`,
    email: teacher.EmailAddress,
    campus: teacher.Campus,
    department: teacher.Department,
  }));
}

export async function getClassesForTeacher(teacherId: string): Promise<AppClass[]> {
  const db = await getConnection();
  // This query aggregates students for each class taught by the teacher
  const result = await db.input('teacherCode', teacherId).query(`
    SELECT
        c.SubjectSetID as id,
        s.Subject as name,
        c.SubjectSetID as subjectId,
        c.TeacherCode as teacherId
    FROM Class c
    JOIN SubjectSet s ON c.SubjectSetID = s.SubjectSetID
    WHERE c.TeacherCode = @teacherCode
    GROUP BY c.SubjectSetID, s.Subject, c.TeacherCode
  `);

  const classes: AppClass[] = await Promise.all(result.recordset.map(async (c: any) => {
     const studentResult = await db.input('subjectSetId', c.id).query('SELECT StudentCode FROM Class WHERE SubjectSetID = @subjectSetId');
     const studentIds = studentResult.recordset.map((s: any) => s.StudentCode);
     
     // Mocking time for now as it's not in the base Class table schema
     return {
        ...c,
        studentIds,
        time: c.id.includes('CS') ? "9:00" : "1:00",
        period: "AM"
     }
  }));

  return classes;
}

export async function getAllClasses(): Promise<AppClass[]> {
    const db = await getConnection();
    const result = await db.query(`
    SELECT
        c.SubjectSetID as id,
        s.Subject as name,
        c.SubjectSetID as subjectId,
        c.TeacherCode as teacherId
    FROM Class c
    JOIN SubjectSet s ON c.SubjectSetID = s.SubjectSetID
    GROUP BY c.SubjectSetID, s.Subject, c.TeacherCode
  `);

  const classes: AppClass[] = await Promise.all(result.recordset.map(async (c: any) => {
     const studentResult = await db.input('subjectSetId', c.id).query('SELECT StudentCode FROM Class WHERE SubjectSetID = @subjectSetId');
     const studentIds = studentResult.recordset.map((s: any) => s.StudentCode.trim());
     
     return {
        id: c.id.trim(),
        name: c.name,
        subjectId: c.subjectId.trim(),
        teacherId: c.teacherId.trim(),
        studentIds,
        time: c.id.includes('CS') ? "9:00" : "1:00", // Mocked
        period: "AM" // Mocked
     }
  }));

  return classes;
}


export async function getClass(classId: string): Promise<AppClass | undefined> {
  const db = await getConnection();
  const result = await db.input('subjectSetId', classId).query(`
    SELECT
        c.SubjectSetID as id,
        s.Subject as name,
        c.SubjectSetID as subjectId,
        c.TeacherCode as teacherId
    FROM Class c
    JOIN SubjectSet s ON c.SubjectSetID = s.SubjectSetID
    WHERE c.SubjectSetID = @subjectSetId
    GROUP BY c.SubjectSetID, s.Subject, c.TeacherCode
  `);

  const classInfo = result.recordset[0];
  if (!classInfo) return undefined;

  const studentResult = await db.input('subjectSetId', classId).query('SELECT StudentCode FROM Class WHERE SubjectSetID = @subjectSetId');
  const studentIds = studentResult.recordset.map((s: any) => s.StudentCode.trim());

  return {
    id: classInfo.id.trim(),
    name: classInfo.name,
    subjectId: classInfo.subjectId.trim(),
    teacherId: classInfo.teacherId.trim(),
    studentIds,
    time: classId.includes('CS') ? "9:00" : "1:00", // Mocked
    period: "AM" // Mocked
  };
}

export async function getStudentsForClass(classId: string): Promise<Student[]> {
  const db = await getConnection();
  const result = await db.input('subjectSetId', classId).query(`
    SELECT s.* FROM Student s
    JOIN Class c ON s.StudentCode = c.StudentCode
    WHERE c.SubjectSetID = @subjectSetId
  `);
  
  return result.recordset.map((student: any) => ({
    id: student.Id,
    studentCode: student.StudentCode,
    nickname: student.StudentNickname,
    name: student.StudentName,
    avatarUrl: `https://placehold.co/100x100.png`,
    email: student.EmailAddress,
    campus: student.Campus,
    form: student.Form
  }));
}

export async function getAllStudents(): Promise<Student[]> {
  const db = await getConnection();
  const result = await db.query('SELECT * FROM Student');
  return result.recordset.map((student: any) => ({
    id: student.Id,
    studentCode: student.StudentCode,
    nickname: student.StudentNickname,
    name: student.StudentName,
    avatarUrl: `https://placehold.co/100x100.png`,
    email: student.EmailAddress,
    campus: student.Campus,
    form: student.Form
  }));
}

export async function getSubject(subjectId: string): Promise<SubjectSet | undefined> {
  const db = await getConnection();
  const result = await db.input('subjectSetId', subjectId).query('SELECT * FROM SubjectSet WHERE SubjectSetID = @subjectSetId');
  const subject = result.recordset[0];
  if (!subject) return undefined;
  return {
    id: subject.Id,
    campus: subject.Campus,
    subjectSetId: subject.SubjectSetID,
    subject: subject.Subject,
    description: subject.SubjectSetDescription,
    credits: subject.Credits,
  };
}

export async function getAllSubjects(): Promise<SubjectSet[]> {
    const db = await getConnection();
    const result = await db.query('SELECT * FROM SubjectSet');
    return result.recordset.map((subject: any) => ({
        id: subject.Id,
        campus: subject.Campus,
        subjectSetId: subject.SubjectSetID,
        subject: subject.Subject,
        description: subject.SubjectSetDescription,
        credits: subject.Credits,
    }));
}


export async function getSessionsForClass(classId: string): Promise<Session[]> {
    const db = await getConnection();
    const result = await db.input('subjectSetId', classId).query('SELECT * FROM Sessions WHERE SubjectSetID = @subjectSetId ORDER BY SessionDate, StartTime');

    return result.recordset.map((session: any) => ({
        id: session.Id,
        name: session.SessionName,
        subjectSetId: session.SubjectSetID.trim(),
        teacherCode: session.TeacherCode.trim(),
        campus: session.Campus.trim(),
        date: new Date(session.SessionDate).toISOString(),
        startTime: session.StartTime,
        endTime: session.EndTime
    }));
}


export async function getSession(sessionId: number): Promise<Session | undefined> {
    const db = await getConnection();
    const result = await db.input('sessionId', sessionId).query('SELECT * FROM Sessions WHERE Id = @sessionId');
    const session = result.recordset[0];
    if (!session) return undefined;
    
    return {
        id: session.Id,
        name: session.SessionName,
        subjectSetId: session.SubjectSetID.trim(),
        teacherCode: session.TeacherCode.trim(),
        campus: session.Campus.trim(),
        date: new Date(session.SessionDate).toISOString(),
        startTime: session.StartTime,
        endTime: session.EndTime
    }
}
