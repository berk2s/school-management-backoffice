import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ClassroomRoutingModule } from './classroom-routing.module'
import { ListClassroomComponent } from './page/list-classroom/list-classroom.component'
import { SharedModule } from '@shared/shared.module';
import { CreateClassroomComponent } from './page/create-classroom/create-classroom.component';
import { AttachStudentComponent } from './page/attach-student/attach-student.component'

@NgModule({
  declarations: [ListClassroomComponent, CreateClassroomComponent, AttachStudentComponent],
  imports: [CommonModule, ClassroomRoutingModule, SharedModule],
})
export class ClassroomModule {}
