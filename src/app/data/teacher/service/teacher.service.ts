import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { exhaustMap, shareReplay, tap } from 'rxjs/operators'
import { generateSearchParams } from 'src/app/helper/generate-params.helper'
import { OrganizationService } from '../../organization/service/orgazation.service'
import { Page, Pagination, SortDirection } from '../../page.types'
import { CreatingTeacher, Teacher } from '../types/teacher.types'

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private teachers: BehaviorSubject<Teacher[]> = new BehaviorSubject(null)

  private pagination: BehaviorSubject<Pagination> = new BehaviorSubject(null)

  constructor(
    private httpClient: HttpClient,
    private organizationService: OrganizationService,
  ) {}

  getTeachers(
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt',
    order: SortDirection = 'desc',
    search: string = '',
  ): Observable<Teacher[]> {
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
          .get<Page<Teacher>>(
            `${environment.api.teacher.url}/organization/${organizationId}`,
            {
              params: params,
            },
          )
          .pipe(
            shareReplay(),
            tap((response: Page<Teacher>) => {
              this.pagination.next({
                length: response.totalElements,
                size: size,
                page: response.number,
                sortedBy: sort,
                order: order,
              })

              this.teachers.next(response.content)
            }),
            exhaustMap((response: Page<Teacher>) => {
              return of(response.content)
            }),
          )
      }),
    )
  }

  createTeacher(creatingTeacher: CreatingTeacher): Observable<Teacher> {
    return combineLatest([this.organizationService.organizationId$]).pipe(
      exhaustMap(([organizationId]) => {
        return this.httpClient
          .post<Teacher>(`${environment.api.teacher.url}`, {
            ...creatingTeacher,
            organizationId: organizationId,
          })
          .pipe(shareReplay())
      }),
    )
  }

  get teachers$() {
    return this.teachers.asObservable()
  }

  get pagination$() {
    return this.pagination.asObservable()
  }
}
