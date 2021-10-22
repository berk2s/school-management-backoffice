import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { FeedService } from 'src/app/data/feed/service/feed.service'
import {
  Announcement,
  AnnouncementChannel,
  FeedPagination,
} from 'src/app/data/feed/types/feed.types'
import { environment } from '@env'
import { tap } from 'rxjs/operators'
import { MatDrawer } from '@angular/material/sidenav'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss'],
})
export class FeedListComponent implements OnInit, OnDestroy {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer

  announcements$: Observable<Announcement[]>
  _pagination: Subscription
  pagination: FeedPagination

  isLoading: boolean = false
  imgBaseUrl: string

  constructor(
    private feedService: FeedService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.imgBaseUrl = environment.imgBaseUrl
    this.announcements$ = this.feedService.getAnnouncements()

    this._pagination = this.feedService.pagination$.subscribe((pagination) => {
      this.pagination = pagination
    })
  }

  ngOnDestroy(): void {
    this._pagination.unsubscribe()
  }

  openDrawer() {
    this.router.navigateByUrl('/akis/ekle')
    this.matDrawer.toggle()
  }
}
