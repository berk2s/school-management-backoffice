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
import { ParentService } from 'src/app/data/parent/service/parent.service'
import { Parent } from 'src/app/data/parent/types/parent.types'
import { UserService } from 'src/app/data/user/service/user.service'

@Component({
  selector: 'app-list-parent',
  templateUrl: './list-parent.component.html',
  styleUrls: ['./list-parent.component.scss'],
})
export class ListParentComponent implements OnInit, OnDestroy {
  parents$: Observable<Parent[]>

  pagination: Pagination
  pageEvent: PageEvent
  sort: Sort = {
    active: 'createdAt',
    direction: 'desc',
  }

  isLoading: boolean = false

  searchInputControl: FormControl = new FormControl()

  private _unsubscribeAll: Subject<any> = new Subject()

  constructor(
    private parentService: ParentService,
    private userService: UserService,
    private alertService: AlertService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.isLoading = true

    this.parents$ = this.parentService.parents$.pipe(shareReplay())

    this.parentService
      .getParents()
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = false
        }),
      )
      .subscribe()

    this.parentService.pagination$
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
          return this.parentService
            .getParents(
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

    this.parentService
      .getParents(
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

    this.parentService
      .getParents(page, size, sort.active, sort.direction as SortDirection)
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = false
        }),
      )
      .subscribe()
  }

  removeParent(parentId: string, fullName: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {
        title: `${fullName} adlı veli`,
        desc: 'Bu veliyi silmek için emin misiniz?',
      },
    })

    this.isLoading = true

    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        exhaustMap((result) => {
          if (result && result === true) {
            return this.parentService.deleteParent(parentId).pipe(
              exhaustMap(() => {
                return this.parentService
                  .getParents(
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
      .subscribe((teachers: Parent[] | boolean) => {
        this.isLoading = false

        if (teachers) {
          this.alertService.sendMessage({
            alertTitle: 'Başarılı',
            alertContent: 'Veli başarılı bir şekilde silindi',
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
