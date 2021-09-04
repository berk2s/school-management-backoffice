import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MaterialModule } from './material.module'
import { FuseAlertModule } from '@fuse/components/alert'
import { FuseCardModule } from '@fuse/components/card'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

@NgModule({
  declarations: [],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  exports: [
    FormsModule,
    ReactiveFormsModule,

    MaterialModule,
    FuseCardModule,
    FuseAlertModule,

    HttpClientModule,
  ],
})
export class SharedModule {}
