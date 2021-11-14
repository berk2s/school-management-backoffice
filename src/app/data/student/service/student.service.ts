import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { exhaustMap, shareReplay, tap } from 'rxjs/operators'
import { generateSearchParams } from 'src/app/helper/generate-params.helper'
import { OrganizationService } from '../../organization/service/orgazation.service'
import { Page, Pagination, SortDirection } from '../../page.types'
import { Student } from '../types/student.types'

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private students: BehaviorSubject<Student[]> = new BehaviorSubject(null)

  private pagination: BehaviorSubject<Pagination> = new BehaviorSubject(null)

  constructor(
    private httpClient: HttpClient,
    private organizationService: OrganizationService,
  ) {}

  getStudents(
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt',
    order: SortDirection = 'desc',
    search: string = '',
  ): Observable<Student[]> {
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
          .get<Page<Student>>(
            `${environment.api.student.url}/organization/${organizationId}`,
            {
              params: params,
            },
          )
          .pipe(
            shareReplay(),
            tap((response: Page<Student>) => {
              this.pagination.next({
                length: response.totalElements,
                size: size,
                page: response.number,
                sortedBy: sort,
                order: order,
              })

              this.students.next(response.content)
            }),
            exhaustMap((response: Page<Student>) => {
              return of(response.content)
            }),
          )
      }),
    )
  }

  get students$() {
    return this.students.asObservable()
  }

  get pagination$() {
    return this.pagination.asObservable()
  }
}
