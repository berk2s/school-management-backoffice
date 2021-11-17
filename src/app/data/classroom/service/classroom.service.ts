import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { exhaustMap, shareReplay, take, tap } from 'rxjs/operators'
import { generateSearchParams } from 'src/app/helper/generate-params.helper'
import { OrganizationService } from '../../organization/service/orgazation.service'
import { Page, Pagination, SortDirection } from '../../page.types'
import {
  Classroom,
  CreatingClassroom,
  EditingClassroom,
} from '../types/classroom.types'

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private classrooms: BehaviorSubject<Classroom[]> = new BehaviorSubject(null)

  private pagination: BehaviorSubject<Pagination> = new BehaviorSubject(null)

  constructor(
    private httpClient: HttpClient,
    private organizationService: OrganizationService,
  ) {}

  getClassrooms(
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt',
    order: SortDirection = 'desc',
    search: string = '',
  ): Observable<Classroom[]> {
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
          .get<Page<Classroom>>(
            `${environment.api.classroom.url}/organization/${organizationId}`,
            {
              params: params,
            },
          )
          .pipe(
            shareReplay(),
            tap((response: Page<Classroom>) => {
              this.pagination.next({
                length: response.totalElements,
                size: size,
                page: response.number,
                sortedBy: sort,
                order: order,
              })

              this.classrooms.next(response.content)
            }),
            exhaustMap((response: Page<Classroom>) => {
              return of(response.content)
            }),
          )
      }),
    )
  }

  createClassroom(creatingClassroom: CreatingClassroom): Observable<Classroom> {
    return combineLatest([this.organizationService.organizationId$]).pipe(
      exhaustMap(([organizationId]) => {
        return this.httpClient
          .post<Classroom>(`${environment.api.classroom.url}`, {
            ...creatingClassroom,
            organizationId: organizationId,
          })
          .pipe(shareReplay())
      }),
    )
  }

  updateClassroom(
    classRoomId: number,
    updatingClassroom: EditingClassroom,
  ): Observable<any> {
    return this.httpClient
      .put(`${environment.api.classroom.url}/${classRoomId}`, {
        ...updatingClassroom,
      })
      .pipe(take(1), shareReplay())
  }

  deleteClassroom(classRoomId: number): Observable<any> {
    return this.httpClient
      .delete(`${environment.api.classroom.url}/${classRoomId}`)
      .pipe(shareReplay())
  }

  get classroom$() {
    return this.classrooms.asObservable()
  }

  get pagination$() {
    return this.pagination.asObservable()
  }
}
