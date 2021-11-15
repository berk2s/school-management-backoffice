import { Organization } from '../../organization/types/organization.types'

export interface Lesson {
  lessonId: number
  lessonName: string
  organization?: Organization
  createdAt: Date
  lastModifiedAt: Date
}

export interface CreatingLesson {
  lessonName: string
  organizationId?: number
}

export interface UpdatingLesson {
  lessonName?: string
}
