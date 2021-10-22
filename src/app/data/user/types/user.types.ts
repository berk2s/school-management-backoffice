import { Organization } from '../../organization/types/organization.types'

export interface User {
  userId: string
  username: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  organization: Organization
  createdAt: Date
  lastModifiedAt: Date
}
