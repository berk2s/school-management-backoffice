import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
  Announcement,
  AnnouncementImage,
  CreatingAnnouncement,
  FeedPagination,
  UpdatingAnnouncement,
} from 'src/app/data/feed/types/feed.types'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { environment } from '@env'
import {
  exhaustMap,
  map,
  mergeMap,
  shareReplay,
  take,
  tap,
} from 'rxjs/operators'
import { OrganizationService } from '../../organization/service/orgazation.service'
import { Page } from '../../page.types'

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private announcements: BehaviorSubject<Announcement[]> = new BehaviorSubject(
    null,
  )

  private pagination: BehaviorSubject<FeedPagination> = new BehaviorSubject(
    null,
  )

  constructor(
    private httpClient: HttpClient,
    private organizationService: OrganizationService,
  ) {}

  get announcements$(): Observable<Announcement[]> {
    return this.announcements.asObservable()
  }

  get pagination$(): Observable<FeedPagination> {
    return this.pagination.asObservable()
  }

  getAnnouncement(announcementId: number): Observable<Announcement> {
    return this.httpClient
      .get<Announcement>(
        `${environment.api.announcement.url}/${announcementId}`,
      )
      .pipe(shareReplay())
  }

  getAnnouncements(
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
    search: string = '',
  ): Observable<Announcement[]> {
    let params = new HttpParams()
    params = params.set('page', page)
    params = params.set('size', size)
    params = params.set('sort', sort)
    params = params.set('order', order)
    params = params.set('search', search)

    return combineLatest([this.organizationService.organizationId$]).pipe(
      exhaustMap((data) => {
        const organizationId = data[0]
        return this.httpClient
          .get<Page<Announcement>>(
            `${environment.api.announcement.url}/organization/${organizationId}`,
            {
              params: params,
            },
          )
          .pipe(
            shareReplay(),
            tap((response: Page<Announcement>) => {
              this.pagination.next({
                length: response.totalElements,
                size: size,
                page: response.number,
                sortedBy: sort,
                order: order,
              })
              this.announcements.next(response.content)
            }),
            exhaustMap((response: Page<Announcement>) => {
              return of(response.content)
            }),
          )
      }),
    )
  }

  saveAnnouncement(
    creatingAnnouncement: CreatingAnnouncement,
  ): Observable<Announcement> {
    return combineLatest([this.organizationService.organizationId$]).pipe(
      exhaustMap((data) => {
        const organizationId = data[0]
        return this.httpClient
          .post<Announcement>(environment.api.announcement.url, {
            ...creatingAnnouncement,
            organizationId: organizationId,
          })
          .pipe(
            shareReplay(),
            exhaustMap((announcement) => {
              if (creatingAnnouncement.images.length == 0) {
                return of(announcement)
              }

              return this.uploadImage(
                announcement.announcementId,
                creatingAnnouncement.images,
              ).pipe(map(() => announcement))
            }),
          )
      }),
    )
  }

  updateAnnouncement(
    announcementId: number,
    updatingAnnouncement: UpdatingAnnouncement,
  ) {
    return this.httpClient
      .put(`${environment.api.announcement.url}/${announcementId}`, {
        ...updatingAnnouncement,
      })
      .pipe(
        shareReplay(),
        mergeMap((response) => {
          if (
            updatingAnnouncement.addedImages &&
            updatingAnnouncement.addedImages.length > 0
          ) {
            return this.uploadImage(
              announcementId,
              updatingAnnouncement.addedImages,
            )
          } else {
            return of(response)
          }
        }),
        mergeMap((response) => {
          if (
            updatingAnnouncement.deletedImages &&
            updatingAnnouncement.deletedImages.length > 0
          ) {
            return this.deleteImage(
              announcementId,
              updatingAnnouncement.deletedImages,
            )
          } else {
            return of(response)
          }
        }),
      )
  }

  deleteAnnouncement(announcementId): Observable<any> {
    return this.httpClient
      .delete(`${environment.api.announcement.url}/${announcementId}`)
      .pipe(take(1), shareReplay())
  }

  uploadImage(
    announcementId: number,
    file: File[],
  ): Observable<AnnouncementImage> {
    const formData: FormData = new FormData()

    for (let i = 0; i < file.length; i++) {
      formData.append('images', file[i])
    }

    const uploadUrl = `${environment.api.announcement.url}/${announcementId}/${environment.api.announcement.uploadImage}`

    return this.httpClient
      .post<AnnouncementImage>(uploadUrl, formData, {
        reportProgress: true,
        responseType: 'json',
      })
      .pipe(take(1))
  }

  deleteImage(announcementId: number, paths: string[]) {
    const deleteUrl = `${environment.api.announcement.url}/${announcementId}/${environment.api.announcement.deleteImage}`

    return this.httpClient.put(deleteUrl, { imageUrls: paths }).pipe(take(1))
  }
}
