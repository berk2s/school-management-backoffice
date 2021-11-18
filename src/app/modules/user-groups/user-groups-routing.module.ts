import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CreateParentResolver } from 'src/app/data/parent/resolvers/create-parent.resolver'
import { CreateTeacherResolver } from 'src/app/data/teacher/resolvers/create-teacher.resolver'
import { CreateParentComponent } from './parent/create-parent/create-parent.component'
import { ListParentComponent } from './parent/list-parent/list-parent.component'
import { StudentListComponent } from './student-list/student-list.component'
import { CreateTeacherComponent } from './teacher/create-teacher/create-teacher.component'
import { ListTeacherComponent } from './teacher/list-teacher/list-teacher.component'

const routes: Routes = [
  {
    path: 'ogrenciler',
    component: StudentListComponent,
  },
  {
    path: 'ogretmenler',
    component: ListTeacherComponent,
  },
  {
    path: 'ogretmenler/ekle',
    component: CreateTeacherComponent,
    resolve: {
      teachingSubjects: CreateTeacherResolver,
    },
  },
  {
    path: 'veliler',
    component: ListParentComponent,
  },
  {
    path: 'veliler/ekle',
    component: CreateParentComponent,
    resolve: {
      students: CreateParentResolver,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserGroupsRoutingModule {}
