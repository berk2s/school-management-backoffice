import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AuthRoutingModule } from './auth-routing.module'
import { SignInComponent } from './page/sign-in/sign-in.component'
import { SharedModule } from '@shared/shared.module';
import { SignOutComponent } from './page/sign-out/sign-out.component'

@NgModule({
  declarations: [SignInComponent, SignOutComponent],
  imports: [CommonModule, AuthRoutingModule, SharedModule],
})
export class AuthModule {}
