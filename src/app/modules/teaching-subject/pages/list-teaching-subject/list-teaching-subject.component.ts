import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { Sort } from '@angular/material/sort'
import { AlertService } from '@app/alert/alert.service'
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component'
import { Observable, of, Subject } from 'rxjs'
import {
  debounceTime,
  exhaustMap,
  shareReplay,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators'
import { Pagination, SortDirection } from 'src/app/data/page.types'
import { TeachingSubjectService } from 'src/app/data/teaching-subject/service/teaching-subject.service'
import { TeachingSubject } from 'src/app/data/teaching-subject/types/teaching-subject.types'

@Component({
  selector: 'app-list-teaching-subject',
  templateUrl: './list-teaching-subject.component.html',
  styleUrls: ['./list-teaching-subject.component.scss'],
})
export class ListTeachingSubjectComponent implements OnInit, OnDestroy {
  teachingSubjects$: Observable<TeachingSubject[]>

  pagination: Pagination
  pageEvent: PageEvent
  sort: Sort = {
    active: 'createdAt',
    direction: 'desc',
  }

  isLoading: boolean = false

  searchInputControl: FormControl = new FormControl()

  private _unsubscribeAll: Subject<any> = new Subject<any>()

  constructor(
    private teachingSubjectService: TeachingSubjectService,
    private alertService: AlertService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.isLoading = true

    this.teachingSubjects$ = this.teachingSubjectService.teachingSubjects$.pipe(
      shareReplay(),
    )

    this.teachingSubjectService
      .getTeachingSubjects()
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = false
        }),
      )
      .subscribe()

    this.teachingSubjectService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagination) => {
        this.pagination = pagination
      })

    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((key) => {
          this.isLoading = true
          return this.teachingSubjectService
            .getTeachingSubjects(
              0,
              10,
              this.sort?.active,
              this.sort?.direction as SortDirection,
              key,
            )
            .pipe(take(1), takeUntil(this._unsubscribeAll))
        }),
        tap(() => {
          this.isLoading = false
        }),
      )
      .subscribe()
  }

  getDatas(event: PageEvent, _sort: Sort = null) {
    let sort: Sort = _sort

    if (!_sort) {
      sort = this.sort
    }

    this.isLoading = true

    this.teachingSubjectService
      .getTeachingSubjects(
        event.pageIndex,
        event.pageSize,
        sort?.active,
        sort?.direction as SortDirection,
      )
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = false
        }),
      )
      .subscribe(() => {})

    return event
  }

  sortData(sort: Sort) {
    let page, size

    if (this.pageEvent) {
      ;(page = this.pageEvent.pageIndex), (size = this.pageEvent.pageSize)
    } else {
      page = 0
      size = 10
    }

    this.sort = sort
    this.isLoading = true

    this.teachingSubjectService
      .getTeachingSubjects(
        page,
        size,
        sort.active,
        sort.direction as SortDirection,
      )
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = false
        }),
      )
      .subscribe()
  }

  removeTeachingSubject(
    teachingSubjectId: number,
    teachingSubjectName: string,
  ) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {
        title: `${teachingSubjectName} adlı ders`,
        desc: 'Bu dersi silmek için emin misin?',
      },
    })

    this.isLoading = true

    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        exhaustMap((result) => {
          if (result && result === true) {
            return this.teachingSubjectService
              .deleteTeachingSubject(teachingSubjectId)
              .pipe(
                exhaustMap(() => {
                  return this.teachingSubjectService
                    .getTeachingSubjects(
                      this.pageEvent?.pageIndex,
                      this.pageEvent?.pageSize,
                      this.sort?.active,
                      this.sort?.direction as SortDirection,
                    )
                    .pipe(
                      take(1),
                      tap(() => {
                        this.isLoading = false
                      }),
                    )
                }),
              )
          } else {
            return of(false)
          }
        }),
      )
      .subscribe((teachingSubjects: TeachingSubject[] | boolean) => {
        this.isLoading = false

        if (teachingSubjects) {
          this.alertService.sendMessage({
            alertTitle: 'Başarılı',
            alertContent: 'Öğretmen branşı başarılı bir şekilde silindi',
            alertType: 'success',
          })
        }
      })
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next()
    this._unsubscribeAll.complete()
  }
}
