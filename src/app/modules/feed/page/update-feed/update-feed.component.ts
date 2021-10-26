import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { of, Subscription } from 'rxjs'
import { switchMap, pluck, catchError, tap } from 'rxjs/operators'
import { FeedService } from 'src/app/data/feed/service/feed.service'
import {
  Announcement,
  AnnouncementChannel,
} from 'src/app/data/feed/types/feed.types'
import { FeedListComponent } from '../feed-list/feed-list.component'

@Component({
  selector: 'app-update-feed',
  templateUrl: './update-feed.component.html',
  styleUrls: ['./update-feed.component.scss'],
})
export class UpdateFeedComponent implements OnInit, OnDestroy {
  announcement: Announcement = null

  announcementForm: FormGroup

  _params$: Subscription

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private feedListComponent: FeedListComponent,
    private feedService: FeedService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this._params$ = this.activatedRoute.params
      .pipe(
        pluck('announcementId'),
        switchMap((announcementId) => {
          return this.feedService.getAnnouncement(announcementId)
        }),
        tap((announcement: Announcement) => {
          this.announcementForm = this.formBuilder.group({
            announcementTitle: [
              announcement.announcementTitle,
              Validators.required,
            ],
            announcementDescription: [announcement.announcementDescription],
            announcementChannels: [
              announcement.announcementChannels,
              Validators.required,
            ],
            announcementStatus: [announcement.announcementStatus],
          })
        }),
        catchError((err) => {
          this.router.navigateByUrl('/akis')
          return of(null)
        }),
      )
      .subscribe((announcement: Announcement) => {
        this.announcement = announcement
      })

    this.feedListComponent.matDrawer.open()
  }

  ngOnDestroy(): void {
    this.feedListComponent.matDrawer.close()

    this._params$.unsubscribe()
  }

  setActivate(activity: boolean) {}

  update() {}

  getAnnouncementChannels() {
    const arr = []
    for (const [key, value] of Object.entries(AnnouncementChannel)) {
      arr.push(value)
    }
    return arr
  }

  getAnnouncementChannelKey(s) {
    let transformedChannel

    for (let announcementChannel in AnnouncementChannel) {
      transformedChannel = Object.keys(AnnouncementChannel).find(
        (key) => AnnouncementChannel[key] === s,
      )
    }

    return transformedChannel
  }
}
