import { TeachingSubject } from '../../teaching-subject/types/teaching-subject.types'
import { CreatingUser, User } from '../../user/types/user.types'

export interface Teacher extends User {
  teachingSubjects?: TeachingSubject[]
}

export interface CreatingTeacher extends CreatingUser {
  teachingSubjects: number[]
}
