import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from '@app/guards/auth.guard'
import { NoAuthGuard } from '@app/guards/no-auth.guard'
import { SignInComponent } from './page/sign-in/sign-in.component'
import { SignOutComponent } from './page/sign-out/sign-out.component'

const routes: Routes = [
  {
    path: 'giris',
    component: SignInComponent,
    canActivate: [NoAuthGuard],
  },
  {
    path: 'cikis',
    component: SignOutComponent,
    canActivate: [AuthGuard],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
