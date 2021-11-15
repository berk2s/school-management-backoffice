import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { LessonRoutingModule } from './lesson-routing.module'
import { ListLessonComponent } from './pages/list-lesson/list-lesson.component'
import { SharedModule } from '@shared/shared.module';
import { CreateLessonComponent } from './pages/create-lesson/create-lesson.component';
import { UpdateLessonComponent } from './pages/update-lesson/update-lesson.component'

@NgModule({
  declarations: [ListLessonComponent, CreateLessonComponent, UpdateLessonComponent],
  imports: [CommonModule, LessonRoutingModule, SharedModule],
})
export class LessonModule {}
