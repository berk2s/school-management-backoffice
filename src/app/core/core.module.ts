import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IconsModule } from './icons/icons.module'
import { FuseNavigationModule } from '@fuse/components/navigation'

@NgModule({
  declarations: [],
  imports: [CommonModule, IconsModule, FuseNavigationModule],
  exports: [FuseNavigationModule],
})
export class CoreModule {}
