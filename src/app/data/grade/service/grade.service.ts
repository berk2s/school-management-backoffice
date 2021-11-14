import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { exhaustMap, shareReplay, tap } from 'rxjs/operators'
import { generateSearchParams } from 'src/app/helper/generate-params.helper'
import { OrganizationService } from '../../organization/service/orgazation.service'
import { Page, Pagination, SortDirection } from '../../page.types'
import { CreatingGrade, Grade, UpdatingGrade } from '../types/grade.types'

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private grades: BehaviorSubject<Grade[]> = new BehaviorSubject(null)

  private pagination: BehaviorSubject<Pagination> = new BehaviorSubject(null)

  constructor(
    private httpClient: HttpClient,
    private organizationService: OrganizationService,
  ) {}

  getGrade(gradeId: number): Observable<Grade> {
    return this.httpClient
      .get<Grade>(`${environment.api.grade.url}/${gradeId}`)
      .pipe(shareReplay())
  }

  getGrades(
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt',
    order: SortDirection = 'desc',
    search: string = '',
  ): Observable<Grade[]> {
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
          .get<Page<Grade>>(
            `${environment.api.grade.url}/organization/${organizationId}`,
            {
              params: params,
            },
          )
          .pipe(
            shareReplay(),
            tap((response: Page<Grade>) => {
              this.pagination.next({
                length: response.totalElements,
                size: size,
                page: response.number,
                sortedBy: sort,
                order: order,
              })

              this.grades.next(response.content)
            }),
            exhaustMap((response: Page<Grade>) => {
              return of(response.content)
            }),
          )
      }),
    )
  }

  createGrade(creatingGrade: CreatingGrade): Observable<Grade> {
    return combineLatest([this.organizationService.organizationId$]).pipe(
      exhaustMap(([organizationId]) => {
        return this.httpClient
          .post<Grade>(environment.api.grade.url, {
            ...creatingGrade,
            organizationId: organizationId,
          })
          .pipe(shareReplay())
      }),
    )
  }

  updateGrade(gradeId: number, updatingGrade: UpdatingGrade): Observable<any> {
    return this.httpClient
      .put(`${environment.api.grade.url}/${gradeId}`, {
        ...updatingGrade,
      })
      .pipe(shareReplay())
  }

  deleteGrade(gradeId: number): Observable<any> {
    return this.httpClient
      .delete(`${environment.api.grade.url}/${gradeId}`)
      .pipe(shareReplay())
  }

  get grades$() {
    return this.grades.asObservable()
  }

  get pagination$() {
    return this.pagination.asObservable()
  }
}
