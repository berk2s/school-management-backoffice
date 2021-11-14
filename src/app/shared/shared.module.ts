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
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component'
import { IdConverterPipe } from './pipes/id-converter.pipe'
import { IdNormalizePipe } from './pipes/id-normalize.pipe'

@NgModule({
  declarations: [
    ErrorTranslatePipe,
    UserDropdownComponent,
    ConfirmationDialogComponent,
    IdConverterPipe,
    IdNormalizePipe,
  ],
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
    IdConverterPipe,
    IdNormalizePipe,
  ],
  providers: [IdNormalizePipe, IdConverterPipe],
})
export class SharedModule {}
