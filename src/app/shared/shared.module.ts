import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MaterialModule } from './material/material.module'
import { FuseAlertModule } from '@fuse/components/alert'
import { FuseCardModule } from '@fuse/components/card'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { ErrorTranslatePipe } from '@shared/pipes/error-translate.pipe'
import { UserDropdownComponent } from './components/layout/user-dropdown/user-dropdown.component'
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key'

@NgModule({
  declarations: [ErrorTranslatePipe, UserDropdownComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  exports: [
    FormsModule,
    ReactiveFormsModule,

    MaterialModule,
    FuseCardModule,
    FuseAlertModule,

    ErrorTranslatePipe,
    FuseFindByKeyPipeModule,

    UserDropdownComponent,

    HttpClientModule,
  ],
})
export class SharedModule {}
