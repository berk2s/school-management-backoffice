import { User } from '../../user/types/user.types'

export interface Student extends User {
  studentNumber: number
  parents: {
    userId: string
    firstName: string
    lastName: string
  }[]
  classRoom: {
    classRoomId: number
    classRoomTag: string
    classNumber: number
    grade: {
      gradeId: number
      gradeName: string
      advisorTeacher: {
        userId: string
        firstName: string
        lastName: string
      }
    }
  }
}
