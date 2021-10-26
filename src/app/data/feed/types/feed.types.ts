import { Organization } from '../../organization/types/organization.types'

export interface FeedPagination {
  length: number
  size: number
  page: number
  sortedBy: string
  order: 'asc' | 'desc'
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
  announcementStatus: boolean
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
