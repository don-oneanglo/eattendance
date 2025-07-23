export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Teacher {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Subject {
  id:string;
  name: string;
  description: string;
}

export interface Class {
  id: string;
  name: string;
  subjectId: string;
  teacherId: string;
  studentIds: string[];
  time: string;
  period: string;
}

export interface StudentWithStatus extends Student {
  status: 'present' | 'absent' | 'late';
}
