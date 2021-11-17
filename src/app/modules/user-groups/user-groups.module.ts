import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { UserGroupsRoutingModule } from './user-groups-routing.module'
import { StudentListComponent } from './student-list/student-list.component'
import { SharedModule } from '@shared/shared.module';
import { ListTeacherComponent } from './teacher/list-teacher/list-teacher.component';
import { CreateTeacherComponent } from './teacher/create-teacher/create-teacher.component'

@NgModule({
  declarations: [StudentListComponent, ListTeacherComponent, CreateTeacherComponent],
  imports: [CommonModule, UserGroupsRoutingModule, SharedModule],
})
export class UserGroupsModule {}
