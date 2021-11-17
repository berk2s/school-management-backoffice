import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { UpdateTeachingSubjectResolver } from 'src/app/data/teaching-subject/resolvers/update-teaching-subject.resolver'
import { CreateTeachingSubjectComponent } from './pages/create-teaching-subject/create-teaching-subject.component'
import { ListTeachingSubjectComponent } from './pages/list-teaching-subject/list-teaching-subject.component'
import { UpdateTeachingSubjectComponent } from './pages/update-teaching-subject/update-teaching-subject.component'

const routes: Routes = [
  {
    path: '',
    component: ListTeachingSubjectComponent,
  },
  {
    path: 'ekle',
    component: CreateTeachingSubjectComponent,
  },
  {
    path: 'duzenle/:teachingSubjectId',
    component: UpdateTeachingSubjectComponent,
    resolve: {
      teachingSubject: UpdateTeachingSubjectResolver,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeachingSubjectRoutingModule {}
