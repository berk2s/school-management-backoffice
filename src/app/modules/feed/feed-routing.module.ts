import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CreateFeedComponent } from './page/create-feed/create-feed.component'
import { FeedListComponent } from './page/feed-list/feed-list.component'

const routes: Routes = [
  {
    path: '',
    component: FeedListComponent,
    children: [
      {
        path: 'ekle',
        component: CreateFeedComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedRoutingModule {}
