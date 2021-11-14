import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { UserGroupsRoutingModule } from './user-groups-routing.module'
import { StudentListComponent } from './student-list/student-list.component'
import { SharedModule } from '@shared/shared.module'

@NgModule({
  declarations: [StudentListComponent],
  imports: [CommonModule, UserGroupsRoutingModule, SharedModule],
})
export class UserGroupsModule {}
