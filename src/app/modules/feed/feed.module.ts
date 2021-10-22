import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { FeedRoutingModule } from './feed-routing.module'
import { FeedListComponent } from './page/feed-list/feed-list.component'
import { SharedModule } from '@shared/shared.module'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { AuthInterceptor } from '@app/interceptors/auth-interceptor';
import { CreateFeedComponent } from './page/create-feed/create-feed.component'

@NgModule({
  declarations: [FeedListComponent, CreateFeedComponent],
  imports: [CommonModule, FeedRoutingModule, SharedModule],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true,
    // },
  ],
})
export class FeedModule {}
