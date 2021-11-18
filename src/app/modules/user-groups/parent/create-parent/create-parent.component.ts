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
import { ParentService } from 'src/app/data/parent/service/parent.service'
import { CreatingParent } from 'src/app/data/parent/types/parent.types'
import { Student } from 'src/app/data/student/types/student.types'

@Component({
  selector: 'app-create-parent',
  templateUrl: './create-parent.component.html',
  styleUrls: ['./create-parent.component.scss'],
})
export class CreateParentComponent implements OnInit, OnDestroy {
  students: Student[]

  createParentForm: FormGroup

  isLoading: boolean = false

  private _unsubscribeAll: Subject<any> = new Subject()

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private parentService: ParentService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(pluck('students'), takeUntil(this._unsubscribeAll))
      .subscribe((students: Student[] | null) => {
        if (!students) {
          this.router.navigateByUrl('/veliler')
          this.alertService.sendMessage({
            alertType: 'warning',
            alertTitle: 'Hay aksi',
            alertContent: 'Beklenmedik bir sorun ile karşılaşıldı',
          })
        } else {
          this.students = students
        }
      })

    this.createParentForm = this.formBuilder.group({
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
      students: [
        [],
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(99),
        ],
      ],
    })

    this.createParentForm.controls['lastName'].valueChanges
      .pipe(debounceTime(300))
      .subscribe((lastName) => {
        if (
          this.createParentForm.controls['firstName'].value.trim() !== '' &&
          lastName.trim() !== ''
        ) {
          const firstName = (this.createParentForm.controls[
            'firstName'
          ].value.trim() as string).toLocaleLowerCase()
          const lastName = (this.createParentForm.controls[
            'lastName'
          ].value.trim() as string).toLocaleLowerCase()
          const generatedUsername =
            `${firstName}${lastName}` + Math.floor(Math.random() * 100)

          this.createParentForm.controls['username'].setValue(generatedUsername)
        }
      })
  }

  createTeacher() {
    if (this.createParentForm.invalid) {
      return
    }

    this.isLoading = true

    this.createParentForm.disable()

    const creatingParent: CreatingParent = {
      ...this.createParentForm.value,
    }

    this.parentService
      .createParent(creatingParent)
      .pipe(take(1), shareReplay())
      .subscribe((teacher) => {
        this.isLoading = false
        this.createParentForm.reset()
        this.createParentForm.enable()

        this.alertService.sendMessage({
          alertTitle: 'Başarılı',
          alertContent: `${teacher.firstName} ${teacher.lastName} adlı veli oluşturuldu.`,
          alertType: 'success',
        })
      })
  }

  clearForm() {
    this.createParentForm.reset()
  }

  ngOnDestroy() {
    this._unsubscribeAll.next()
    this._unsubscribeAll.complete()
  }
}
