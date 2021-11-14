import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { exhaustMap, shareReplay, tap } from 'rxjs/operators'
import { generateSearchParams } from 'src/app/helper/generate-params.helper'
import { OrganizationService } from '../../organization/service/orgazation.service'
import { Page, Pagination, SortDirection } from '../../page.types'
import {
  CreatingGradeCategory,
  GradeCategory,
  UpdatingGradeCategory,
} from '../types/grade-category.types'

@Injectable({
  providedIn: 'root',
})
export class GradeCategoryService {
  private gradeCategories: BehaviorSubject<
    GradeCategory[]
  > = new BehaviorSubject(null)

  private pagination: BehaviorSubject<Pagination> = new BehaviorSubject(null)

  constructor(
    private httpClient: HttpClient,
    private organizationService: OrganizationService,
  ) {}

  getAllGradeCategories(): Observable<GradeCategory[]> {
    return this.getGradeCategories(0, 1000000)
  }

  getGradeCategory(gradeCategoryId: number): Observable<GradeCategory> {
    return this.httpClient
      .get<GradeCategory>(
        `${environment.api.gradeCategory.url}/${gradeCategoryId}`,
      )
      .pipe(shareReplay())
  }

  getGradeCategories(
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt',
    order: SortDirection = 'desc',
    search: string = '',
  ): Observable<GradeCategory[]> {
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
          .get<Page<GradeCategory>>(
            `${environment.api.gradeCategory.url}/organization/${organizationId}`,
            {
              params: params,
            },
          )
          .pipe(
            shareReplay(),
            tap((response: Page<GradeCategory>) => {
              this.pagination.next({
                length: response.totalElements,
                size: size,
                page: response.number,
                sortedBy: sort,
                order: order,
              })

              this.gradeCategories.next(response.content)
            }),
            exhaustMap((response: Page<GradeCategory>) => {
              return of(response.content)
            }),
          )
      }),
    )
  }

  createGradeCategory(
    creatingGradeCategory: CreatingGradeCategory,
  ): Observable<GradeCategory> {
    return combineLatest([this.organizationService.organizationId$]).pipe(
      exhaustMap(([organizationId]) => {
        return this.httpClient
          .post<GradeCategory>(environment.api.gradeCategory.url, {
            ...creatingGradeCategory,
            organizationId: organizationId,
          })
          .pipe(shareReplay())
      }),
    )
  }

  updateGradeCategory(
    gradeCategoryId: number,
    updatingGradeCategory: UpdatingGradeCategory,
  ): Observable<any> {
    return this.httpClient
      .put(
        `${environment.api.gradeCategory.url}/${gradeCategoryId}`,
        updatingGradeCategory,
      )
      .pipe(shareReplay())
  }

  deleteGradeCategory(id: number): Observable<any> {
    return this.httpClient
      .delete(`${environment.api.gradeCategory.url}/${id}`)
      .pipe(shareReplay())
  }

  get gradeCategories$() {
    return this.gradeCategories.asObservable()
  }

  get pagination$() {
    return this.pagination.asObservable()
  }
}
