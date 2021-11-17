import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AlertService } from '@app/alert/alert.service'
import { SubDrawerLayoutComponent } from '@layouts/sub-drawer-layout/sub-drawer-layout.component'
import { Subject } from 'rxjs'
import { pluck, shareReplay, take } from 'rxjs/operators'
import { ClassroomService } from 'src/app/data/classroom/service/classroom.service'
import {
  Classroom,
  EditingClassroom,
} from 'src/app/data/classroom/types/classroom.types'
import { Student } from 'src/app/data/student/types/student.types'

@Component({
  selector: 'app-attach-student',
  templateUrl: './attach-student.component.html',
  styleUrls: ['./attach-student.component.scss'],
})
export class AttachStudentComponent implements OnInit, OnDestroy {
  classrooms: Classroom[]
  students: Student[]

  attachStudentForm: FormGroup

  isLoading: boolean = false

  private _unsubscribeAll: Subject<any> = new Subject()

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private formBuilder: FormBuilder,
    private subDrawerLayoutComponent: SubDrawerLayoutComponent,
    private classroomService: ClassroomService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(pluck('defaultData'))
      .subscribe(([classrooms, students]) => {
        if (classrooms && students) {
          this.classrooms = classrooms
          this.students = students
        } else {
          this.router.navigateByUrl('/sinif')
          this.alertService.sendMessage({
            alertType: 'warning',
            alertTitle: 'Ops',
            alertContent: 'Bir şeyler ters gitti.',
          })
        }
      })

    this.attachStudentForm = this.formBuilder.group({
      classroomId: [, [Validators.required]],
      addedStudents: [[], [Validators.required, Validators.min(1)]],
    })
  }

  submitForm() {
    if (this.attachStudentForm.invalid) {
      return
    }

    this.isLoading = true
    this.attachStudentForm.disable()

    const classRoomId = this.attachStudentForm.controls['classroomId']
      .value as number

    const attachStudent: EditingClassroom = {
      addedStudents: this.attachStudentForm.controls['addedStudents'].value,
    }

    this.classroomService
      .updateClassroom(classRoomId, attachStudent)
      .pipe(take(1), shareReplay())
      .subscribe(() => {
        this.isLoading = false
        this.attachStudentForm.reset()
        this.attachStudentForm.enable()

        this.alertService.sendMessage({
          alertType: 'success',
          alertTitle: 'Öğrenciler eklendi',
          alertContent: 'Öğrenci(ler) başarıyla sınıfa eklendi!',
        })
      })
  }

  clearForm() {
    this.attachStudentForm.reset()
  }

  toggleDrawer() {
    this.subDrawerLayoutComponent.matDrawer.toggle()
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next()
    this._unsubscribeAll.complete()
  }
}
