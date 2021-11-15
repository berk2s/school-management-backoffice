import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { exhaustMap, shareReplay, tap } from 'rxjs/operators'
import { generateSearchParams } from 'src/app/helper/generate-params.helper'
import { OrganizationService } from '../../organization/service/orgazation.service'
import { Page, Pagination, SortDirection } from '../../page.types'
import { CreatingLesson, Lesson, UpdatingLesson } from '../types/lesson.types'

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private lessons: BehaviorSubject<Lesson[]> = new BehaviorSubject(null)

  private pagination: BehaviorSubject<Pagination> = new BehaviorSubject(null)

  constructor(
    private httpClient: HttpClient,
    private organizationService: OrganizationService,
  ) {}

  getLesson(lessonId: number): Observable<Lesson> {
    return this.httpClient
      .get<Lesson>(`${environment.api.lesson.url}/${lessonId}`)
      .pipe(shareReplay())
  }

  getLessons(
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt',
    order: SortDirection = 'desc',
    search: string = '',
  ): Observable<Lesson[]> {
    const params: HttpParams = generateSearchParams(
      page,
      size,
      sort,
      order,
      search,
    )

    return combineLatest([this.organizationService.organizationId$]).pipe(
      exhaustMap(([organizationId]) => {
        return this.httpClient
          .get<Page<Lesson>>(
            `${environment.api.lesson.url}/organization/${organizationId}`,
            {
              params: params,
            },
          )
          .pipe(
            shareReplay(),
            tap((response: Page<Lesson>) => {
              this.pagination.next({
                length: response.totalElements,
                size: size,
                page: response.number,
                sortedBy: sort,
                order: order,
              })

              this.lessons.next(response.content)
            }),
            exhaustMap((response: Page<Lesson>) => {
              return of(response.content)
            }),
          )
      }),
    )
  }

  createLesson(creatingLesson: CreatingLesson): Observable<Lesson> {
    return combineLatest([this.organizationService.organizationId$]).pipe(
      exhaustMap(([organizationId]) => {
        return this.httpClient
          .post<Lesson>(`${environment.api.lesson.url}`, {
            ...creatingLesson,
            organizationId: organizationId,
          })
          .pipe(shareReplay())
      }),
    )
  }

  updateLesson(
    lessonId: number,
    updatingLesson: UpdatingLesson,
  ): Observable<any> {
    return this.httpClient
      .put(`${environment.api.lesson.url}/${lessonId}`, {
        ...updatingLesson,
      })
      .pipe(shareReplay())
  }

  deleteLesson(lessonId: number): Observable<any> {
    return this.httpClient
      .delete(`${environment.api.lesson.url}/${lessonId}`)
      .pipe(shareReplay())
  }

  get lessons$() {
    return this.lessons.asObservable()
  }

  get pagination$() {
    return this.pagination.asObservable()
  }
}
