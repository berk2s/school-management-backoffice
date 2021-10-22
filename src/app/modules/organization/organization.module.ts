import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationRoutingModule } from './organization-routing.module';
import { GradeListComponent } from './page/grade/grade-list/grade-list.component';
import { CreateGradeComponent } from './page/grade/create-grade/create-grade.component';
import { ClassroomListComponent } from './page/classroom/classroom-list/classroom-list.component';


@NgModule({
  declarations: [
    GradeListComponent,
    CreateGradeComponent,
    ClassroomListComponent
  ],
  imports: [
    CommonModule,
    OrganizationRoutingModule
  ]
})
export class OrganizationModule { }
