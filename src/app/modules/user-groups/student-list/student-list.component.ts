import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { FormControl } from '@angular/forms'
import { PageEvent } from '@angular/material/paginator'
import { Sort } from '@angular/material/sort'
import { Observable, Subject } from 'rxjs'
import {
  debounceTime,
  shareReplay,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators'
import { Pagination, SortDirection } from 'src/app/data/page.types'
import { StudentService } from 'src/app/data/student/service/student.service'
import { Student } from 'src/app/data/student/types/student.types'

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent implements OnInit, OnDestroy {
  students$: Observable<Student[]>

  pagination: Pagination
  pageEvent: PageEvent
  sort: Sort = {
    active: 'createdAt',
    direction: 'desc',
  }

  isLoading: boolean = false

  searchInputControl: FormControl = new FormControl()

  private _unsubscribeAll: Subject<any> = new Subject<any>()

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.isLoading = true

    this.students$ = this.studentService.students$.pipe(shareReplay())

    this.studentService
      .getStudents()
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = false
        }),
      )
      .subscribe()

    this.studentService.pagination$
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
          return this.studentService
            .getStudents(
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

    this.studentService
      .getStudents(
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

    this.studentService
      .getStudents(page, size, sort.active, sort.direction as SortDirection)
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = false
        }),
      )
      .subscribe()
  }

  removeStudent(studentId: string, fullName: string) {}

  ngOnDestroy(): void {
    this._unsubscribeAll.next()
    this._unsubscribeAll.complete()
  }
}
