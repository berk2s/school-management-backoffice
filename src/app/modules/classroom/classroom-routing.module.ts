import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { classroomNavigationData } from '@app/navigation/classroom/classroom-navigation.data'
import { SubDrawerLayoutComponent } from '@layouts/sub-drawer-layout/sub-drawer-layout.component'
import { AttachStudentResolver } from 'src/app/data/classroom/resolvers/attach-student.resolver'
import { CreateClassroomResolver } from 'src/app/data/classroom/resolvers/create-classroom.resolver'
import { AttachStudentComponent } from './page/attach-student/attach-student.component'
import { CreateClassroomComponent } from './page/create-classroom/create-classroom.component'
import { ListClassroomComponent } from './page/list-classroom/list-classroom.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'siniflar',
    pathMatch: 'full',
  },
  {
    path: 'siniflar',
    component: SubDrawerLayoutComponent,
    data: {
      menuData: classroomNavigationData,
    },
    children: [
      {
        path: '',
        component: ListClassroomComponent,
      },
    ],
  },
  {
    path: 'ekle',
    component: SubDrawerLayoutComponent,
    data: {
      menuData: classroomNavigationData,
    },
    children: [
      {
        path: '',
        component: CreateClassroomComponent,
        resolve: {
          defaultData: CreateClassroomResolver,
        },
      },
    ],
  },
  {
    path: 'ogrenci-ekle',
    component: SubDrawerLayoutComponent,
    data: {
      menuData: classroomNavigationData,
    },
    children: [
      {
        path: '',
        component: AttachStudentComponent,
        resolve: {
          defaultData: AttachStudentResolver,
        },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassroomRoutingModule {}
