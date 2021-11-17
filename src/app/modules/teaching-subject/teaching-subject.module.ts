import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { TeachingSubjectRoutingModule } from './teaching-subject-routing.module'
import { ListTeachingSubjectComponent } from './pages/list-teaching-subject/list-teaching-subject.component'
import { SharedModule } from '@shared/shared.module';
import { CreateTeachingSubjectComponent } from './pages/create-teaching-subject/create-teaching-subject.component';
import { UpdateTeachingSubjectComponent } from './pages/update-teaching-subject/update-teaching-subject.component'

@NgModule({
  declarations: [ListTeachingSubjectComponent, CreateTeachingSubjectComponent, UpdateTeachingSubjectComponent],
  imports: [CommonModule, TeachingSubjectRoutingModule, SharedModule],
})
export class TeachingSubjectModule {}
