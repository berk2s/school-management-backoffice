import { Organization } from '../../organization/types/organization.types'

export interface TeachingSubject {
  teachingSubjectId: number
  subjectName: string
  organization: Organization
  teachers?: {
    userId: string
    username: string
    firstName: string
    lastName: string
    phoneNumber: string
  }[]
  createdAt: Date
  lastModifiedAt: Date
}

export interface CreatingTeachingSubject {
  subjectName: string
  teachers: string[]
  organizationId?: number
}

export interface UpdatingTeachingSubject {
  subjectName?: string
  addedTeachers?: string[]
  removedTeachers?: string[]
}
