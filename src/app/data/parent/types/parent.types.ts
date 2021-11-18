import { Student } from '../../student/types/student.types'
import { CreatingUser, User } from '../../user/types/user.types'

export interface Parent extends User {
  students?: Student[]
}

export interface CreatingParent extends CreatingUser {
  students?: string[]
}
