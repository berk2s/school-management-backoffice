import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { StudentListComponent } from './student-list/student-list.component'

const routes: Routes = [
  {
    path: 'ogrenciler',
    component: StudentListComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserGroupsRoutingModule {}
