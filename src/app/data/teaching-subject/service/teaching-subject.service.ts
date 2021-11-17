import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { exhaustMap, shareReplay, tap } from 'rxjs/operators'
import { generateSearchParams } from 'src/app/helper/generate-params.helper'
import { OrganizationService } from '../../organization/service/orgazation.service'
import { Page, Pagination, SortDirection } from '../../page.types'
import {
  CreatingTeachingSubject,
  TeachingSubject,
  UpdatingTeachingSubject,
} from '../types/teaching-subject.types'

@Injectable({
  providedIn: 'root',
})
export class TeachingSubjectService {
  private teachingSubjects: BehaviorSubject<
    TeachingSubject[]
  > = new BehaviorSubject(null)

  private pagination: BehaviorSubject<Pagination> = new BehaviorSubject(null)

  constructor(
    private httpClient: HttpClient,
    private organizationService: OrganizationService,
  ) {}

  getTeachingSubject(teachingSubjectId: number): Observable<TeachingSubject> {
    return this.httpClient
      .get<TeachingSubject>(
        `${environment.api.teachingSubject.url}/${teachingSubjectId}`,
      )
      .pipe(shareReplay())
  }

  getTeachingSubjects(
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt',
    order: SortDirection = 'desc',
    search: string = '',
  ): Observable<TeachingSubject[]> {
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
          .get<Page<TeachingSubject>>(
            `${environment.api.teachingSubject.url}/organization/${organizationId}`,
            {
              params: params,
            },
          )
          .pipe(
            shareReplay(),
            tap((response: Page<TeachingSubject>) => {
              this.pagination.next({
                length: response.totalElements,
                size: size,
                page: response.number,
                sortedBy: sort,
                order: order,
              })

              this.teachingSubjects.next(response.content)
            }),
            exhaustMap((response: Page<TeachingSubject>) => {
              return of(response.content)
            }),
          )
      }),
    )
  }

  createTeachingSubject(
    creatingTeachingSubject: CreatingTeachingSubject,
  ): Observable<TeachingSubject> {
    return combineLatest([this.organizationService.organizationId$]).pipe(
      exhaustMap(([organizationId]) => {
        return this.httpClient
          .post<TeachingSubject>(`${environment.api.teachingSubject.url}`, {
            ...creatingTeachingSubject,
            organizationId: organizationId,
          })
          .pipe(shareReplay())
      }),
    )
  }

  updateTeachingSubject(
    teachingSubjectId: number,
    updatingTeachingSubject: UpdatingTeachingSubject,
  ): Observable<any> {
    return this.httpClient
      .put(`${environment.api.teachingSubject.url}/${teachingSubjectId}`, {
        ...updatingTeachingSubject,
      })
      .pipe(shareReplay())
  }

  deleteTeachingSubject(teachingSubjectId: number): Observable<any> {
    return this.httpClient
      .delete(`${environment.api.teachingSubject.url}/${teachingSubjectId}`)
      .pipe(shareReplay())
  }

  get teachingSubjects$() {
    return this.teachingSubjects.asObservable()
  }

  get pagination$() {
    return this.pagination.asObservable()
  }
}
