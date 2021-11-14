import { Organization } from '../../organization/types/organization.types'

export interface User {
  userId: string
  username: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  organization: Organization
  userType: UserType
  isEnabled?: boolean
  isAccountNonExpired?: boolean
  isAnnountNonLocked?: boolean
  isCredentialsNonExpired?: boolean
  createdAt: Date
  lastModifiedAt: Date
}

export enum UserType {
  STUDENT,
  PARENT,
  TEACHER,
  USER,
}
