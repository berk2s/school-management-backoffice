import { NgModule } from '@angular/core'
import {
  ExtraOptions,
  PreloadAllModules,
  RouterModule,
  Routes,
} from '@angular/router'
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
    data: {
      layout: 'classic',
    },
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule,
      ),
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, routerConfig)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
