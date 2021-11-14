import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { GradeRoutingModule } from './grade-routing.module'
import { GradeListComponent } from './page/grade/grade-list/grade-list.component'
import { CreateGradeComponent } from './page/grade/create-grade/create-grade.component'
import { SharedModule } from '@shared/shared.module'
import { FuseNavigationModule } from '@fuse/components/navigation'
import { GradeCategoryListComponent } from './page/grade-category/grade-category-list/grade-category-list.component'
import { CreateGradeCategoryComponent } from './page/grade-category/create-grade-category/create-grade-category.component'
import { UpdateGradeComponent } from './page/grade/update-grade/update-grade.component'
import { UpdateGradeCategoryComponent } from './page/grade-category/update-grade-category/update-grade-category.component'

@NgModule({
  declarations: [
    GradeListComponent,
    CreateGradeComponent,
    GradeCategoryListComponent,
    CreateGradeCategoryComponent,
    UpdateGradeComponent,
    UpdateGradeCategoryComponent,
  ],
  imports: [
    CommonModule,
    GradeRoutingModule,
    SharedModule,
    FuseNavigationModule,
  ],
})
export class GradeModule {}
