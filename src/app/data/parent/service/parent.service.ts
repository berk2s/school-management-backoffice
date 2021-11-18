import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { exhaustMap, shareReplay, take, tap } from 'rxjs/operators'
import { generateSearchParams } from 'src/app/helper/generate-params.helper'
import { OrganizationService } from '../../organization/service/orgazation.service'
import { Page, Pagination, SortDirection } from '../../page.types'
import { CreatingParent, Parent } from '../types/parent.types'

@Injectable({
  providedIn: 'root',
})
export class ParentService {
  private parents: BehaviorSubject<Parent[]> = new BehaviorSubject(null)

  private pagination: BehaviorSubject<Pagination> = new BehaviorSubject(null)

  constructor(
    private httpClient: HttpClient,
    private organizationService: OrganizationService,
  ) {}

  getParents(
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt',
    order: SortDirection = 'desc',
    search: string = '',
  ): Observable<Parent[]> {
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
          .get<Page<Parent>>(
            `${environment.api.parent.url}/organization/${organizationId}`,
            {
              params: params,
            },
          )
          .pipe(
            shareReplay(),
            tap((response: Page<Parent>) => {
              this.pagination.next({
                length: response.totalElements,
                size: size,
                page: response.number,
                sortedBy: sort,
                order: order,
              })

              this.parents.next(response.content)
            }),
            exhaustMap((response: Page<Parent>) => {
              return of(response.content)
            }),
          )
      }),
    )
  }

  createParent(creatingParent: CreatingParent): Observable<Parent> {
    return combineLatest([this.organizationService.organizationId$]).pipe(
      exhaustMap(([organizationId]) => {
        return this.httpClient
          .post<Parent>(`${environment.api.parent.url}`, {
            ...creatingParent,
            organizationId: organizationId,
          })
          .pipe(shareReplay())
      }),
    )
  }

  deleteParent(parentId: string): Observable<any> {
    return this.httpClient
      .delete(`${environment.api.parent.url}/${parentId}`)
      .pipe(shareReplay())
  }

  get parents$() {
    return this.parents.asObservable()
  }

  get pagination$() {
    return this.pagination.asObservable()
  }
}
