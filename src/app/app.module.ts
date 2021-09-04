import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { appConfig } from '@app/config/app.config'
import { CoreModule } from '@app/core.module'
import { SharedModule } from '@shared/shared.module'
import { FuseModule } from '@fuse/fuse.module'
import { FuseConfigModule } from 'src/@fuse/services/config/config.module'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component'
import { MainLayoutComponent } from './layout/main-layout/main-layout.component'
import { ClassicLayoutComponent } from './layout/classic-layout/classic-layout.component'
@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    ClassicLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    FuseModule,
    FuseConfigModule.forRoot(appConfig),

    CoreModule,

    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
