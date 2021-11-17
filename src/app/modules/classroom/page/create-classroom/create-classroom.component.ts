import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AlertService } from '@app/alert/alert.service'
import { SubDrawerLayoutComponent } from '@layouts/sub-drawer-layout/sub-drawer-layout.component'
import { Subject } from 'rxjs'
import { map, pluck, share, shareReplay, take } from 'rxjs/operators'
import { ClassroomService } from 'src/app/data/classroom/service/classroom.service'
import {
  Classroom,
  CreatingClassroom,
} from 'src/app/data/classroom/types/classroom.types'
import { Grade } from 'src/app/data/grade/types/grade.types'
import { Teacher } from 'src/app/data/teacher/types/teacher.types'

@Component({
  selector: 'app-create-classroom',
  templateUrl: './create-classroom.component.html',
  styleUrls: ['./create-classroom.component.scss'],
})
export class CreateClassroomComponent implements OnInit, OnDestroy {
  teachers: Teacher[]
  grades: Grade[]

  createClassroomForm: FormGroup

  isLoading: boolean = false

  private _unsubscribeAll: Subject<any> = new Subject()

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private classroomService: ClassroomService,
    private alertService: AlertService,
    private subDrawerLayoutComponent: SubDrawerLayoutComponent,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(pluck('defaultData'))
      .subscribe(([grades, teachers]) => {
        if (grades && teachers) {
          this.teachers = teachers
          this.grades = grades
        } else {
          this.router.navigateByUrl('/sinif')
          this.alertService.sendMessage({
            alertType: 'warning',
            alertTitle: 'Ops',
            alertContent: 'Bir şeyler ters gitti.',
          })
        }
      })

    this.createClassroomForm = this.formBuilder.group({
      classRoomTag: [
        '',
        [Validators.required, Validators.min(3), Validators.max(300)],
      ],
      classNumber: [''],
      advisorTeacherId: [null, [Validators.required]],
      gradeId: [null, [Validators.required]],
    })
  }

  submitForm(): void {
    if (this.createClassroomForm.invalid) {
      return
    }

    this.isLoading = true
    this.createClassroomForm.disable()

    const creatingClassroom: CreatingClassroom = {
      ...this.createClassroomForm.value,
    }

    this.classroomService
      .createClassroom(creatingClassroom)
      .pipe(take(1), shareReplay())
      .subscribe((classRoom: Classroom) => {
        this.isLoading = false
        this.createClassroomForm.reset()
        this.createClassroomForm.enable()
        if (classRoom) {
          this.alertService.sendMessage({
            alertType: 'success',
            alertTitle: 'Başarılı',
            alertContent: `${classRoom.classRoomTag} adlı sınıf başarılı şekilde eklendi.`,
          })
        }
      })
  }

  clearForm() {
    this.createClassroomForm.reset()
  }

  toggleDrawer() {
    this.subDrawerLayoutComponent.matDrawer.toggle()
  }

  ngOnDestroy() {
    this._unsubscribeAll.next()
    this._unsubscribeAll.complete()
  }
}
