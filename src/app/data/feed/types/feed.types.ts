import { Organization } from '../../organization/types/organization.types'

export interface FeedPagination {
  length: number
  size: number
  page: number
  lastPage: number
  startIndex: number
  endIndex: number
}

export enum AnnouncementChannel {
  STUDENTS = 'Öğrenciler',
  TEACHERS = 'Öğretmenler',
  PARENTS = 'Veliler',
}

export interface Announcement {
  announcementId: number
  announcementImages?: string[]
  announcementTitle: string
  announcementDescription?: string
  announcementChannels: AnnouncementChannel[]
  organization: Organization
  createdAt: Date
  lastModifiedAt: Date
}

export interface AnnouncementImage {
  announcementId: number
  imageUrl: string
  imageSize?: number
}

export interface CreatingAnnouncement {
  announcementTitle: string
  announcementDescription?: string
  announcementChannels: AnnouncementChannel[]
  announcementStatus: boolean
  organizationId?: number
}
