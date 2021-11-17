import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AlertService } from '@app/alert/alert.service'
import { Subject } from 'rxjs'
import {
  debounceTime,
  pluck,
  shareReplay,
  take,
  takeUntil,
} from 'rxjs/operators'
import { TeacherService } from 'src/app/data/teacher/service/teacher.service'
import { CreatingTeacher } from 'src/app/data/teacher/types/teacher.types'
import { TeachingSubject } from 'src/app/data/teaching-subject/types/teaching-subject.types'

@Component({
  selector: 'app-create-teacher',
  templateUrl: './create-teacher.component.html',
  styleUrls: ['./create-teacher.component.scss'],
})
export class CreateTeacherComponent implements OnInit, OnDestroy {
  teachingSubjects: TeachingSubject[]

  createTeacherForm: FormGroup

  isLoading: boolean = false

  private _unsubscribeAll: Subject<any> = new Subject()

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private teacherService: TeacherService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(pluck('teachingSubjects'), takeUntil(this._unsubscribeAll))
      .subscribe((teachingSubjects: TeachingSubject[] | null) => {
        if (!teachingSubjects) {
          this.router.navigateByUrl('/ogretmenler')
          this.alertService.sendMessage({
            alertTitle: 'Hay aksi',
            alertContent: 'Bir şeyler ters gitti, tekrar deneyiniz.',
            alertType: 'error',
          })
        } else {
          this.teachingSubjects = teachingSubjects
        }
      })

    this.createTeacherForm = this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(99),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(99),
        ],
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(99),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(99),
        ],
      ],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      email: ['', [Validators.maxLength(99)]],
      teachingSubjects: [
        [],
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(99),
        ],
      ],
    })

    this.createTeacherForm.controls['lastName'].valueChanges
      .pipe(debounceTime(300))
      .subscribe((lastName) => {
        if (
          this.createTeacherForm.controls['firstName'].value.trim() !== '' &&
          lastName.trim() !== ''
        ) {
          const firstName = (this.createTeacherForm.controls[
            'firstName'
          ].value.trim() as string).toLocaleLowerCase()
          const lastName = (this.createTeacherForm.controls[
            'lastName'
          ].value.trim() as string).toLocaleLowerCase()
          const generatedUsername =
            `${firstName}${lastName}` + Math.floor(Math.random() * 100)

          this.createTeacherForm.controls['username'].setValue(
            generatedUsername,
          )
        }
      })
  }

  createTeacher() {
    if (this.createTeacherForm.invalid) {
      return
    }

    this.isLoading = true

    this.createTeacherForm.disable()

    const creatingTeacher: CreatingTeacher = {
      ...this.createTeacherForm.value,
    }

    this.teacherService
      .createTeacher(creatingTeacher)
      .pipe(take(1), shareReplay())
      .subscribe((teacher) => {
        this.isLoading = false
        this.createTeacherForm.reset()
        this.createTeacherForm.enable()

        this.alertService.sendMessage({
          alertTitle: 'Başarılı',
          alertContent: `${teacher.firstName} ${teacher.lastName} adlı öğretmen oluşturuldu.`,
          alertType: 'success',
        })
      })
  }

  clearForm() {
    this.createTeacherForm.reset()
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next()
    this._unsubscribeAll.complete()
  }
}
