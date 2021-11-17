import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AlertService } from '@app/alert/alert.service'
import { Subject } from 'rxjs'
import { pluck, shareReplay, take, takeUntil } from 'rxjs/operators'
import { TeachingSubjectService } from 'src/app/data/teaching-subject/service/teaching-subject.service'
import {
  TeachingSubject,
  UpdatingTeachingSubject,
} from 'src/app/data/teaching-subject/types/teaching-subject.types'

@Component({
  selector: 'app-update-teaching-subject',
  templateUrl: './update-teaching-subject.component.html',
  styleUrls: ['./update-teaching-subject.component.scss'],
})
export class UpdateTeachingSubjectComponent implements OnInit, OnDestroy {
  teachingSubject: TeachingSubject

  updateTeachingSubjectForm: FormGroup

  isLoading: boolean = false

  private _unsubscribeAll: Subject<any> = new Subject<any>()

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private teachingSubjectService: TeachingSubjectService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true

    this.activatedRoute.data
      .pipe(pluck('teachingSubject'), takeUntil(this._unsubscribeAll))
      .subscribe((teachingSubject: TeachingSubject | null) => {
        this.isLoading = false

        if (!teachingSubject) {
          this.router.navigateByUrl('/ogretmen-branslari')
          this.alertService.sendMessage({
            alertTitle: 'Hay aksi',
            alertContent: 'Bir şeyler ters gitti, tekrar deneyiniz.',
            alertType: 'error',
          })
        } else {
          this.teachingSubject = teachingSubject

          this.updateTeachingSubjectForm = this.formBuilder.group({
            subjectName: [
              teachingSubject.subjectName,
              [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(99),
              ],
            ],
          })
        }
      })
  }

  updateTeachingSubject() {
    if (this.updateTeachingSubjectForm.invalid) {
      return
    }

    let updatingTeachingSubject: UpdatingTeachingSubject = {}

    if (
      this.teachingSubject.subjectName !==
      this.updateTeachingSubjectForm.controls['subjectName'].value.trim()
    ) {
      updatingTeachingSubject = {
        ...updatingTeachingSubject,
        subjectName: this.updateTeachingSubjectForm.controls['subjectName']
          .value,
      }
    }

    if (Object.keys(updatingTeachingSubject).length > 0) {
      this.isLoading = true
      this.updateTeachingSubjectForm.disable()

      this.teachingSubjectService
        .updateTeachingSubject(
          this.teachingSubject.teachingSubjectId,
          updatingTeachingSubject,
        )
        .pipe(take(1), shareReplay())
        .subscribe(() => {
          this.isLoading = false
          this.updateTeachingSubjectForm.enable()

          this.alertService.sendMessage({
            alertTitle: 'Başarılı',
            alertContent: `Öğretmen branşı başarılı bir şekilde düzenlendi.`,
            alertType: 'success',
          })
        })
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next()
    this._unsubscribeAll.complete()
  }
}
