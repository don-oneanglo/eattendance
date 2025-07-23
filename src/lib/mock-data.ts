import type { Student, Teacher, Subject, Class } from './types';

export const students: Student[] = [
  { id: 'S001', name: 'Alice Johnson', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'S002', name: 'Bob Williams', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'S003', name: 'Charlie Brown', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'S004', name: 'Diana Miller', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'S005', name: 'Ethan Garcia', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'S006', name: 'Fiona Davis', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'S007', name: 'George Rodriguez', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'S008', name: 'Hannah Wilson', avatarUrl: 'https://placehold.co/100x100.png' },
];

export const teachers: Teacher[] = [
  { id: 'T01', name: 'Mr. David Smith', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'T02', name: 'Ms. Emily White', avatarUrl: 'https://placehold.co/100x100.png' },
];

export const subjects: Subject[] = [
  { id: 'SUB01', name: 'Calculus I', description: 'Introductory course to differential and integral calculus.' },
  { id: 'SUB02', name: 'World History', description: 'A survey of world history from ancient civilizations to the present.' },
  { id: 'SUB03', name: 'Physics 101', description: 'Fundamentals of mechanics, heat, and sound.' },
  { id: 'SUB04', name: 'Creative Writing', description: 'Workshop for developing fiction and poetry skills.' },
];

export const classes: Class[] = [
  { 
    id: 'C01', 
    name: 'Morning Calculus', 
    subjectId: 'SUB01', 
    teacherId: 'T01', 
    studentIds: ['S001', 'S002', 'S003', 'S004'], 
    time: "9:00",
    period: "AM"
  },
  { 
    id: 'C02', 
    name: 'Afternoon Physics', 
    subjectId: 'SUB03', 
    teacherId: 'T01', 
    studentIds: ['S005', 'S006', 'S007', 'S008'],
    time: "1:00",
    period: "PM"
  },
  { 
    id: 'C03', 
    name: 'Intro to History', 
    subjectId: 'SUB02', 
    teacherId: 'T02', 
    studentIds: ['S001', 'S003', 'S005', 'S007'],
    time: "10:30",
    period: "AM"
  },
  {
    id: 'C04',
    name: 'Advanced Writing',
    subjectId: 'SUB04',
    teacherId: 'T02',
    studentIds: ['S002', 'S004', 'S006', 'S008'],
    time: "2:30",
    period: "PM"
  }
];

// Helper functions to query mock data
export const getTeacher = (teacherId: string) => teachers.find(t => t.id === teacherId);

export const getClassesForTeacher = (teacherId: string) => classes.filter(c => c.id && c.teacherId === teacherId);

export const getClass = (classId: string) => classes.find(c => c.id === classId);

export const getStudentsForClass = (classId: string) => {
  const classInfo = getClass(classId);
  if (!classInfo) return [];
  return students.filter(s => classInfo.studentIds.includes(s.id));
};

export const getSubject = (subjectId: string) => subjects.find(s => s.id === subjectId);
