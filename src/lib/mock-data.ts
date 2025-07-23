import type { Student, Teacher, SubjectSet, ClassEnrollment, AppClass, Session } from './types';

// Insert sample data for Student
export const students: Student[] = [
  { id: 1, studentCode: 'S001', nickname: 'Johnny', name: 'John Doe', email: 'john.doe@email.com', campus: 'Main', form: 'Form 1A', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 2, studentCode: 'S002', nickname: 'Janie', name: 'Jane Smith', email: 'jane.smith@email.com', campus: 'Main', form: 'Form 1B', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 3, studentCode: 'S003', nickname: 'Mike', name: 'Mike Johnson', email: 'mike.johnson@email.com', campus: 'Main', form: 'Form 2A', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 4, studentCode: 'S004', nickname: 'Sarah', name: 'Sarah Wilson', email: 'sarah.wilson@email.com', campus: 'Main', form: 'Form 1A', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 5, studentCode: 'S005', nickname: 'Tommy', name: 'Tom Brown', email: 'tom.brown@email.com', campus: 'Main', form: 'Form 1B', avatarUrl: 'https://placehold.co/100x100.png' },
];

// Insert sample data for Teacher
export const teachers: Teacher[] = [
  { id: 1, teacherCode: 'T001', nickname: 'Dr. Alice', name: 'Dr. Alice Anderson', email: 'alice.anderson@email.com', campus: 'Main', department: 'Computer Science', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 2, teacherCode: 'T002', nickname: 'Prof. Bob', name: 'Prof. Bob Baker', email: 'bob.baker@email.com', campus: 'Main', department: 'Mathematics', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 3, teacherCode: 'T003', nickname: 'Dr. Carol', name: 'Dr. Carol Clark', email: 'carol.clark@email.com', campus: 'Main', department: 'Physics', avatarUrl: 'https://placehold.co/100x100.png' },
];

// Insert sample data for SubjectSet
export const subjects: SubjectSet[] = [
  { id: 1, campus: 'Main', subjectSetId: 'CS101', subject: 'Introduction to Programming', description: 'Basic programming concepts', credits: 4 },
  { id: 2, campus: 'Main', subjectSetId: 'MATH201', subject: 'Calculus I', description: 'Differential calculus', credits: 3 },
  { id: 3, campus: 'Main', subjectSetId: 'PHYS101', subject: 'General Physics', description: 'Mechanics and thermodynamics', credits: 4 },
  { id: 4, campus: 'Main', subjectSetId: 'CS201', subject: 'Data Structures', description: 'Advanced programming concepts', credits: 4 },
  { id: 5, campus: 'Main', subjectSetId: 'MATH301', subject: 'Linear Algebra', description: 'Vectors and matrices', credits: 3 },
];

// Insert sample data for Class
export const classEnrollments: ClassEnrollment[] = [
  { id: 1, campus: 'Main', subjectSetId: 'CS101', teacherCode: 'T001', studentCode: 'S001' },
  { id: 2, campus: 'Main', subjectSetId: 'CS101', teacherCode: 'T001', studentCode: 'S004' },
  { id: 3, campus: 'Main', subjectSetId: 'MATH201', teacherCode: 'T002', studentCode: 'S002' },
  { id: 4, campus: 'Main', subjectSetId: 'MATH201', teacherCode: 'T002', studentCode: 'S005' },
  { id: 5, campus: 'Main', subjectSetId: 'PHYS101', teacherCode: 'T003', studentCode: 'S003' },
  // Adding more enrollments to better represent classes
  { id: 6, campus: 'Main', subjectSetId: 'CS101', teacherCode: 'T001', studentCode: 'S002' },
  { id: 7, campus: 'Main', subjectSetId: 'PHYS101', teacherCode: 'T003', studentCode: 'S001' },
];

// This aggregation logic is a stand-in for what a backend/database would do.
const aggregatedClasses = classEnrollments.reduce((acc, current) => {
    const { subjectSetId, teacherCode, studentCode } = current;
    if (!acc[subjectSetId]) {
        const subject = subjects.find(s => s.subjectSetId === subjectSetId);
        acc[subjectSetId] = {
            id: subjectSetId,
            name: subject?.subject || 'Unknown Class',
            subjectId: subjectSetId,
            teacherId: teacherCode,
            studentIds: [],
            // Mocking time, this would come from the Sessions table in a real app
            time: subjectSetId.includes('CS') ? "9:00" : "1:00",
            period: "AM"
        };
    }
    if (!acc[subjectSetId].studentIds.includes(studentCode)) {
        acc[subjectSetId].studentIds.push(studentCode);
    }
    return acc;
}, {} as Record<string, AppClass>);

export const classes: AppClass[] = Object.values(aggregatedClasses);

// Insert sample data for Sessions
export const sessions: Session[] = [
  { id: 1, name: 'CS101 Morning Session', subjectSetId: 'CS101', teacherCode: 'T001', campus: 'Main', date: '2024-07-29', startTime: '09:00', endTime: '10:30' },
  { id: 2, name: 'CS101 Afternoon Session', subjectSetId: 'CS101', teacherCode: 'T001', campus: 'Main', date: '2024-07-29', startTime: '14:00', endTime: '15:30' },
  { id: 3, name: 'MATH201 Morning Session', subjectSetId: 'MATH201', teacherCode: 'T002', campus: 'Main', date: '2024-07-29', startTime: '10:00', endTime: '11:30' },
];


// Helper functions to query mock data
export const getTeacher = (teacherId: string) => teachers.find(t => t.teacherCode === teacherId);

export const getClassesForTeacher = (teacherId: string) => classes.filter(c => c.id && c.teacherId === teacherId);

export const getClass = (classId: string) => classes.find(c => c.id === classId);

export const getStudentsForClass = (classId: string) => {
  const classInfo = getClass(classId);
  if (!classInfo) return [];
  return students.filter(s => classInfo.studentIds.includes(s.studentCode));
};

export const getSubject = (subjectId: string) => subjects.find(s => s.subjectSetId === subjectId);

export const getSessionsForClass = (classId: string) => sessions.filter(s => s.subjectSetId === classId);

export const getSession = (sessionId: number) => sessions.find(s => s.id === sessionId);
