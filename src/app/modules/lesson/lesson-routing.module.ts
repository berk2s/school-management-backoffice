import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { UpdateLessonResolver } from 'src/app/data/lesson/resolvers/update-lesson.resolver'
import { CreateLessonComponent } from './pages/create-lesson/create-lesson.component'
import { ListLessonComponent } from './pages/list-lesson/list-lesson.component'
import { UpdateLessonComponent } from './pages/update-lesson/update-lesson.component'

const routes: Routes = [
  {
    path: '',
    component: ListLessonComponent,
  },
  {
    path: 'ekle',
    component: CreateLessonComponent,
  },
  {
    path: 'duzenle/:lessonId',
    component: UpdateLessonComponent,
    resolve: {
      lesson: UpdateLessonResolver,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonRoutingModule {}
