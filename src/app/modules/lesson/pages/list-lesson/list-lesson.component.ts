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
import { LessonService } from 'src/app/data/lesson/service/lesson.service'
import { Lesson } from 'src/app/data/lesson/types/lesson.types'
import { Pagination, SortDirection } from 'src/app/data/page.types'

@Component({
  selector: 'app-list-lesson',
  templateUrl: './list-lesson.component.html',
  styleUrls: ['./list-lesson.component.scss'],
})
export class ListLessonComponent implements OnInit, OnDestroy {
  lessons$: Observable<Lesson[]>

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
    private lessonService: LessonService,
    private alertService: AlertService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.isLoading = true

    this.lessons$ = this.lessonService.lessons$.pipe(shareReplay())

    this.lessonService
      .getLessons()
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = false
        }),
      )
      .subscribe(() => {})

    this.lessonService.pagination$
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
          return this.lessonService
            .getLessons(
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
      .subscribe(() => {})
  }

  getDatas(event: PageEvent, _sort: Sort = null) {
    let sort: Sort = _sort

    if (!_sort) {
      sort = this.sort
    }

    this.isLoading = true

    this.lessonService
      .getLessons(
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

    this.lessonService
      .getLessons(page, size, sort.active, sort.direction as SortDirection)
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = false
        }),
      )
      .subscribe()
  }

  removeLesson(lessonId: number, lessonName: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {
        title: `${lessonName} adlı ders`,
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
            return this.lessonService.deleteLesson(lessonId).pipe(
              exhaustMap(() => {
                return this.lessonService
                  .getLessons(
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
      .subscribe((lessons: Lesson[] | boolean) => {
        this.isLoading = false

        if (lessons) {
          this.alertService.sendMessage({
            alertTitle: 'Başarılı',
            alertContent: 'Ders başarılı bir şekilde silindi',
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
