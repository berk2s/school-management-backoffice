import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { classroomNavigationData } from '@app/navigation/classroom/classroom-navigation.data'
import { SubDrawerLayoutComponent } from '@layouts/sub-drawer-layout/sub-drawer-layout.component'
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
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassroomRoutingModule {}
