import { Grade } from '../../grade/types/grade.types'

export interface GradeCategory {
  gradeCategoryId: number
  gradeCategoryName: string
  grades?: Grade[]
  createdAt: Date
  lastModifiedAt: Date
}

export interface CreatingGradeCategory {
  gradeCategoryName: string
  organizationId?: number
}

export interface UpdatingGradeCategory {
  gradeCategoryName?: string
}
