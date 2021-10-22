import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
  Announcement,
  AnnouncementImage,
  CreatingAnnouncement,
  FeedPagination,
} from 'src/app/data/feed/types/feed.types'
import { BehaviorSubject, Observable } from 'rxjs'
import { environment } from '@env'
import { exhaustMap, tap } from 'rxjs/operators'
import { OrganizationService } from '../../organization/service/orgazation.service'

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

  getAnnouncements(
    page: number = 0,
    size: number = 10,
    sort: string = 'name',
    order: 'asc' | 'desc' | '' = 'asc',
    search: string = '',
  ): Observable<Announcement[]> {
    const params = new HttpParams()
    params.append('page', page)
    params.append('size', size)

    return this.organizationService.organizationId$.pipe(
      exhaustMap((organizationId: number) => {
        return this.httpClient
          .get<Announcement[]>(
            `${environment.api.announcement.url}/organization/${organizationId}`,
            {
              params: params,
            },
          )
          .pipe(
            tap((announcements) => {
              this.pagination.next({
                length: 10,
                size: 10,
                page: 0,
                lastPage: 10,
                startIndex: 0,
                endIndex: 9,
              })
              this.announcements.next(announcements)
            }),
          )
      }),
    )
  }

  saveAnnouncement(
    creatingAnnouncement: CreatingAnnouncement,
  ): Observable<Announcement> {
    return this.organizationService.organizationId$.pipe(
      exhaustMap((organizationId: number) => {
        return this.httpClient.post<Announcement>(
          environment.api.announcement.url,
          {
            ...creatingAnnouncement,
            organizationId: organizationId,
          },
        )
      }),
    )
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
