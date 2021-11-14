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
import { GradeCategoryService } from 'src/app/data/grade-category/service/grade-category.service'
import { GradeCategory } from 'src/app/data/grade-category/types/grade-category.types'
import { Pagination, SortDirection } from 'src/app/data/page.types'

@Component({
  selector: 'app-grade-category-list',
  templateUrl: './grade-category-list.component.html',
  styleUrls: ['./grade-category-list.component.scss'],
})
export class GradeCategoryListComponent implements OnInit, OnDestroy {
  gradeCategories$: Observable<GradeCategory[]>

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
    private gradeCategoryService: GradeCategoryService,
    private dialog: MatDialog,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true

    this.gradeCategories$ = this.gradeCategoryService.gradeCategories$.pipe(
      shareReplay(),
    )

    this.gradeCategoryService
      .getGradeCategories()
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = false
        }),
      )
      .subscribe()

    this.gradeCategoryService.pagination$
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
          return this.gradeCategoryService
            .getGradeCategories(
              0,
              10,
              this.sort?.active,
              this.sort?.direction as SortDirection,
              key,
            )
            .pipe(take(1))
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

    this.gradeCategoryService
      .getGradeCategories(
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

    this.gradeCategoryService
      .getGradeCategories(
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

  removeGradeCategory(gradeCategoryId: number, gradeCategoryName: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: `${gradeCategoryName} adlı şube kategorisi`,
        desc: 'Bu şube kategorisini silmek için emin misin?',
      },
    })

    this.isLoading = true

    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        exhaustMap((result) => {
          if (result && result === true) {
            return this.gradeCategoryService
              .deleteGradeCategory(gradeCategoryId)
              .pipe(
                exhaustMap(() => {
                  return this.gradeCategoryService
                    .getGradeCategories(
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
      .subscribe((gradeCategories: GradeCategory[] | boolean) => {
        this.isLoading = false

        if (gradeCategories) {
          this.alertService.sendMessage({
            alertTitle: 'Başarılı',
            alertContent: 'Şube kategorisi başarılı bir şekilde silindi',
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
