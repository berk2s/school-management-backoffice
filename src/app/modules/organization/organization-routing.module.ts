import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { GradeListComponent } from './page/grade/grade-list/grade-list.component'

const routes: Routes = [
  {
    path: 'sube',
    component: GradeListComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule {}
