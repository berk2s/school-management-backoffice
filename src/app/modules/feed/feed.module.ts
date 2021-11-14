import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { FeedRoutingModule } from './feed-routing.module'
import { FeedListComponent } from './page/feed-list/feed-list.component'
import { SharedModule } from '@shared/shared.module'
import { CreateFeedComponent } from './page/create-feed/create-feed.component'
import { UpdateFeedComponent } from './page/update-feed/update-feed.component'

@NgModule({
  declarations: [FeedListComponent, CreateFeedComponent, UpdateFeedComponent],
  imports: [CommonModule, FeedRoutingModule, SharedModule],
  providers: [],
})
export class FeedModule {}
