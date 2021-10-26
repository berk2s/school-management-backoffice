import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
  Announcement,
  AnnouncementImage,
  CreatingAnnouncement,
  FeedPagination,
} from 'src/app/data/feed/types/feed.types'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { environment } from '@env'
import {
  exhaustMap,
  first,
  shareReplay,
  switchMap,
  take,
  tap,
  throttleTime,
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
          .pipe(shareReplay())
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
    file: File,
  ): Observable<AnnouncementImage> {
    const formData: FormData = new FormData()

    formData.append('file', file)

    const uploadUrl = `${environment.api.announcement.url}/${announcementId}/${environment.api.announcement.uploadImage}`

    return this.httpClient.post<AnnouncementImage>(uploadUrl, formData, {
      reportProgress: true,
      responseType: 'json',
    })
  }
}
