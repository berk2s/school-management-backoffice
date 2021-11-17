import { Grade } from '../../grade/types/grade.types'
import { Student } from '../../student/types/student.types'
import { Teacher } from '../../teacher/types/teacher.types'

export interface Classroom {
  classRoomId: number
  classRoomTag: string
  classNumber?: number
  advisorTeacher?: Teacher
  students?: Student[]
  grade: Grade
  createdAt: Date
  lastModifiedAt: Date
}

export interface CreatingClassroom {
  classRoomTag: string
  classNumber?: number
  advisorTeacherId: string
  organizationId?: number
  gradeId: number
}

export interface EditingClassroom {
  classRoomTag?: string
  advisorTeacherId?: string
  addedStudents?: string[]
  deletedStudents?: string[]
}
