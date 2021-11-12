import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router'
import { of } from 'rxjs'
import { catchError, take } from 'rxjs/operators'
import { FeedService } from '../service/feed.service'

@Injectable({
  providedIn: 'root',
})
export class UpdateFeedResolver implements Resolve<any> {
  constructor(private feedService: FeedService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const announcementId = route.params.announcementId

    return this.feedService.getAnnouncement(announcementId).pipe(
      take(1),
      catchError(() => of(null)),
    )
  }
}
