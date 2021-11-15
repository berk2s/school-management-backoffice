import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassroomRoutingModule } from './classroom-routing.module';
import { ListClassroomComponent } from './page/list-classroom/list-classroom.component';


@NgModule({
  declarations: [
    ListClassroomComponent
  ],
  imports: [
    CommonModule,
    ClassroomRoutingModule
  ]
})
export class ClassroomModule { }
