import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { gradeNavigationData } from '@app/navigation/grade/grade-navigation.data'
import { SubDrawerLayoutComponent } from '@layouts/sub-drawer-layout/sub-drawer-layout.component'
import { UpdateGradeCategoryResolver } from 'src/app/data/grade-category/resolvers/update-grade-category.resolver'
import { CreateGradeResolver } from 'src/app/data/grade/resolvers/create-grade.resolver'
import { UpdateGradeResolver } from 'src/app/data/grade/resolvers/update-grade.resolver'
import { CreateGradeCategoryComponent } from './page/grade-category/create-grade-category/create-grade-category.component'
import { GradeCategoryListComponent } from './page/grade-category/grade-category-list/grade-category-list.component'
import { UpdateGradeCategoryComponent } from './page/grade-category/update-grade-category/update-grade-category.component'
import { CreateGradeComponent } from './page/grade/create-grade/create-grade.component'
import { GradeListComponent } from './page/grade/grade-list/grade-list.component'
import { UpdateGradeComponent } from './page/grade/update-grade/update-grade.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'subeler',
    pathMatch: 'full',
  },
  {
    path: 'subeler',
    component: SubDrawerLayoutComponent,
    data: {
      menuData: gradeNavigationData,
    },
    children: [
      {
        path: '',
        component: GradeListComponent,
      },
      {
        path: 'duzenle/:gradeId',
        component: UpdateGradeComponent,
        resolve: {
          grade: UpdateGradeResolver,
          gradeCategories: CreateGradeResolver,
        },
      },
    ],
  },
  {
    path: 'ekle',
    component: SubDrawerLayoutComponent,
    data: {
      menuData: gradeNavigationData,
    },
    children: [
      {
        path: '',
        component: CreateGradeComponent,
        resolve: {
          gradeCategories: CreateGradeResolver,
        },
      },
    ],
  },
  {
    path: 'kategoriler',
    component: SubDrawerLayoutComponent,
    data: {
      menuData: gradeNavigationData,
    },
    children: [
      {
        path: '',
        component: GradeCategoryListComponent,
      },
      {
        path: 'duzenle/:gradeCategoryId',
        component: UpdateGradeCategoryComponent,
        resolve: {
          gradeCategory: UpdateGradeCategoryResolver,
        },
      },
    ],
  },
  {
    path: 'kategori/ekle',
    component: SubDrawerLayoutComponent,
    data: {
      menuData: gradeNavigationData,
    },
    children: [
      {
        path: '',
        component: CreateGradeCategoryComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GradeRoutingModule {}
