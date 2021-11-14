import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { Sort } from '@angular/material/sort'
import { AlertService } from '@app/alert/alert.service'
import { SubDrawerLayoutComponent } from '@layouts/sub-drawer-layout/sub-drawer-layout.component'
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
import { GradeService } from 'src/app/data/grade/service/grade.service'
import { Grade } from 'src/app/data/grade/types/grade.types'
import { Pagination, SortDirection } from 'src/app/data/page.types'

@Component({
  selector: 'app-grade-list',
  templateUrl: './grade-list.component.html',
  styleUrls: ['./grade-list.component.scss'],
})
export class GradeListComponent implements OnInit, OnDestroy {
  grades$: Observable<Grade[]>

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
    private gradeService: GradeService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private subDrawerLayoutComponent: SubDrawerLayoutComponent,
  ) {}

  ngOnInit(): void {
    this.isLoading = true

    this.grades$ = this.gradeService.grades$.pipe(shareReplay())

    this.gradeService
      .getGrades()
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = false
        }),
      )
      .subscribe()

    this.gradeService.pagination$
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
          return this.gradeService
            .getGrades(
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

    this.gradeService
      .getGrades(
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

    this.gradeService
      .getGrades(page, size, sort.active, sort.direction as SortDirection)
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = false
        }),
      )
      .subscribe()
  }

  removeGrade(gradeId: number, gradeName: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {
        title: `${gradeName} adlı şube`,
        desc: 'Bu şubeyi silmek için emin misin?',
      },
    })

    this.isLoading = true

    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        exhaustMap((result) => {
          if (result && result === true) {
            return this.gradeService.deleteGrade(gradeId).pipe(
              exhaustMap(() => {
                return this.gradeService
                  .getGrades(
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
      .subscribe((grades: Grade[] | boolean) => {
        this.isLoading = false

        if (grades) {
          this.alertService.sendMessage({
            alertTitle: 'Başarılı',
            alertContent: 'Şube başarılı bir şekilde silindi',
            alertType: 'success',
          })
        }
      })
  }

  toggleDrawer() {
    this.subDrawerLayoutComponent.matDrawer.toggle()
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next()
    this._unsubscribeAll.complete()
  }
}
