import { NgModule } from '@angular/core'
import {
  ExtraOptions,
  PreloadAllModules,
  RouterModule,
  Routes,
} from '@angular/router'
import { AuthGuard } from '@app/guards/auth.guard'
import { MainLayoutComponent } from '@layouts/main-layout/main-layout.component'

const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: 'enabled',
}

const routes: Routes = [
  {
    path: 'oturum',
    component: MainLayoutComponent,
    data: {
      layout: 'empty',
    },
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'anasayfa',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      layout: 'classic',
    },
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule,
      ),
  },
  {
    path: 'akis',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      layout: 'classic',
    },
    loadChildren: () =>
      import('./modules/feed/feed.module').then((m) => m.FeedModule),
  },
  {
    path: 'organizasyon',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      layout: 'classic',
    },
    loadChildren: () =>
      import('./modules/organization/organization.module').then(
        (m) => m.OrganizationModule,
      ),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, routerConfig)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
