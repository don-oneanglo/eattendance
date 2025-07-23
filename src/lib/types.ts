
export interface Student {
  id: number;
  studentCode: string;
  nickname: string;
  name: string;
  avatarUrl: string; // was StudentImage
  email: string;
  campus: string;
  form: string;
}

export interface Teacher {
  id: number;
  teacherCode: string;
  nickname: string;
  name: string;
  avatarUrl: string; // was TeacherImage
  email: string;
  campus: string;
  department: string;
}

export interface SubjectSet {
  id: number;
  campus: string;
  subjectSetId: string;
  subject: string;
  description: string;
  credits: number;
}

// This represents a row in the Class table, which is a mapping
export interface ClassEnrollment {
  id: number;
  campus: string;
  subjectSetId: string;
  teacherCode: string;
  studentCode: string;
}

// This is a more useful structure for the application UI
export interface AppClass {
  id: string; // Using SubjectSetID for this
  name: string;
  subjectId: string;
  teacherId: string; // teacherCode
  studentIds: string[]; // studentCodes
  time: string;
  period: string;
}

export interface Session {
    id: number;
    name: string;
    subjectSetId: string;
    teacherCode: string;
    campus: string;
    date: string;
    startTime: string;
    endTime: string;
}


export interface StudentWithStatus extends Student {
  status: 'present' | 'absent' | 'late';
  remarks?: string;
}
