import { GradeCategory } from '../../grade-category/types/grade-category.types'
import { Organization } from '../../organization/types/organization.types'

export interface Grade {
  gradeId: number
  gradeName: string
  classrooms: {
    classRoomId: number
    classRoomTag: string
    classNumber: string
  }
  gradeCategory?: GradeCategory
  organization: Organization
  createdAt: Date
  lastModifiedAt: Date
}

export interface CreatingGrade {
  gradeName: string
  gradeCategoryId: number
  organizationId?: number
}

export interface UpdatingGrade {
  gradeName?: string
  newGradeCategoryId?: number
}
