import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { UserGroupsRoutingModule } from './user-groups-routing.module'
import { StudentListComponent } from './student-list/student-list.component'
import { SharedModule } from '@shared/shared.module';
import { ListTeacherComponent } from './teacher/list-teacher/list-teacher.component';
import { CreateTeacherComponent } from './teacher/create-teacher/create-teacher.component';
import { ListParentComponent } from './parent/list-parent/list-parent.component';
import { CreateParentComponent } from './parent/create-parent/create-parent.component'

@NgModule({
  declarations: [StudentListComponent, ListTeacherComponent, CreateTeacherComponent, ListParentComponent, CreateParentComponent],
  imports: [CommonModule, UserGroupsRoutingModule, SharedModule],
})
export class UserGroupsModule {}
