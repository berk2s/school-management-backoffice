import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AlertService } from '@app/alert/alert.service'
import { Subject } from 'rxjs'
import { pluck, shareReplay, take, takeUntil } from 'rxjs/operators'
import { LessonService } from 'src/app/data/lesson/service/lesson.service'
import { Lesson, UpdatingLesson } from 'src/app/data/lesson/types/lesson.types'

@Component({
  selector: 'app-update-lesson',
  templateUrl: './update-lesson.component.html',
  styleUrls: ['./update-lesson.component.scss'],
})
export class UpdateLessonComponent implements OnInit, OnDestroy {
  lesson: Lesson

  updateLessonForm: FormGroup

  isLoading: boolean = false

  private _unsubscribeAll: Subject<any> = new Subject<any>()

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private lessonService: LessonService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.isLoading = true

    this.activatedRoute.data
      .pipe(pluck('lesson'), takeUntil(this._unsubscribeAll))
      .subscribe((lesson: Lesson) => {
        this.isLoading = false

        if (!lesson) {
          this.router.navigateByUrl('/ders')
          this.alertService.sendMessage({
            alertTitle: 'Hay aksi',
            alertContent: 'Bir şeyler ters gitti, tekrar deneyiniz.',
            alertType: 'error',
          })
        } else {
          this.lesson = lesson

          this.updateLessonForm = this.formBuilder.group({
            lessonName: [
              lesson.lessonName,
              [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100),
              ],
            ],
          })
        }
      })
  }

  updateLesson() {
    if (this.updateLessonForm.invalid) {
      return
    }

    let updatingLesson: UpdatingLesson = {}

    if (
      this.lesson.lessonName !==
      this.updateLessonForm.controls['lessonName'].value.trim()
    ) {
      updatingLesson = {
        ...updatingLesson,
        lessonName: this.updateLessonForm.controls['lessonName'].value,
      }
    }

    if (Object.keys(updatingLesson).length > 0) {
      this.isLoading = true
      this.updateLessonForm.disable()

      this.lessonService
        .updateLesson(this.lesson.lessonId, updatingLesson)
        .pipe(take(1), shareReplay())
        .subscribe(() => {
          this.isLoading = false
          this.updateLessonForm.enable()

          this.alertService.sendMessage({
            alertTitle: 'Başarılı',
            alertContent: `Ders başarılı bir şekilde düzenlendi.`,
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
