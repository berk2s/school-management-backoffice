import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { UpdateFeedResolver } from 'src/app/data/feed/resolvers/update-feed.resolver'
import { CreateFeedComponent } from './page/create-feed/create-feed.component'
import { FeedListComponent } from './page/feed-list/feed-list.component'
import { UpdateFeedComponent } from './page/update-feed/update-feed.component'

const routes: Routes = [
  {
    path: '',
    component: FeedListComponent,
    children: [
      {
        path: 'ekle',
        component: CreateFeedComponent,
      },
      {
        path: 'duzenle/:announcementId',
        component: UpdateFeedComponent,
        resolve: {
          announcement: UpdateFeedResolver,
        },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedRoutingModule {}
