import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { Observable, of, Subject } from 'rxjs'
import { FeedService } from 'src/app/data/feed/service/feed.service'
import {
  Announcement,
  AnnouncementChannel,
  FeedPagination,
} from 'src/app/data/feed/types/feed.types'
import { environment } from '@env'
import {
  debounceTime,
  exhaustMap,
  switchMap,
  take,
  takeUntil,
  tap,
  shareReplay,
} from 'rxjs/operators'
import { MatDrawer } from '@angular/material/sidenav'
import { Router } from '@angular/router'
import { PageEvent } from '@angular/material/paginator'
import { MatDialog } from '@angular/material/dialog'
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component'
import { AlertService } from '@app/alert/alert.service'
import { Sort } from '@angular/material/sort'
import { FormControl } from '@angular/forms'
import { SortDirection } from 'src/app/data/page.types'

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss'],
})
export class FeedListComponent implements OnInit, OnDestroy {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer

  announcements$: Observable<Announcement[]>

  pagination: FeedPagination
  pageEvent: PageEvent

  sort: Sort

  searchInputControl: FormControl = new FormControl()

  isLoading: boolean = true
  imgBaseUrl: string

  private _unsubscribeAll: Subject<any> = new Subject<any>()

  constructor(
    private feedService: FeedService,
    private router: Router,
    private dialog: MatDialog,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.imgBaseUrl = environment.imgBaseUrl

    this.sort = {
      active: 'createdAt',
      direction: 'desc',
    }

    this.announcements$ = this.feedService.announcements$.pipe(shareReplay())

    this.feedService
      .getAnnouncements()
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = false
        }),
      )
      .subscribe()

    this.feedService.pagination$
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
          this.matDrawer.close()
          return this.feedService
            .getAnnouncements(
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
      .subscribe((announcements) => {
        // this.announcements = announcements
        if (this.sort) {
          this.sortData(this.sort)
        }
      })
  }

  getDatas(event: PageEvent, _sort: Sort = null) {
    let sort: Sort = _sort

    if (!_sort) {
      sort = this.sort
    }

    this.isLoading = true
    this.feedService
      .getAnnouncements(
        event.pageIndex,
        event.pageSize,
        sort?.active,
        sort?.direction as SortDirection,
      )
      .pipe(take(1))
      .subscribe((announcements) => {
        this.isLoading = false
      })

    return event
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next()
    this._unsubscribeAll.complete()
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

    this.feedService
      .getAnnouncements(
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

  getAnnouncementChannel(announcementChannel) {
    return AnnouncementChannel[announcementChannel]
  }

  removeAnnouncement(id: number, title: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: {
        title: `${title} adlı duyuru`,
        desc: 'Bu duyuru silmek için emin misin?',
      },
    })

    this.isLoading = true

    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        exhaustMap((result) => {
          if (result && result === true) {
            return this.feedService.deleteAnnouncement(id).pipe(
              exhaustMap(() => {
                return this.feedService
                  .getAnnouncements(
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
      .subscribe((announcements: Announcement[] | boolean) => {
        if (announcements) {
          this.alertService.sendMessage({
            alertTitle: 'Başarılı',
            alertContent: 'Duyuru başarılı bir şekilde silindi',
            alertType: 'success',
          })
        }
      })
  }

  openDrawer() {
    this.router.navigateByUrl('/akis/ekle')
    this.matDrawer.toggle()
  }
}
