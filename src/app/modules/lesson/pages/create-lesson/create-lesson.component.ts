import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AlertService } from '@app/alert/alert.service'
import { shareReplay, take } from 'rxjs/operators'
import { LessonService } from 'src/app/data/lesson/service/lesson.service'
import { CreatingLesson } from 'src/app/data/lesson/types/lesson.types'

@Component({
  selector: 'app-create-lesson',
  templateUrl: './create-lesson.component.html',
  styleUrls: ['./create-lesson.component.scss'],
})
export class CreateLessonComponent implements OnInit {
  createLessonForm: FormGroup

  isLoading: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private lessonService: LessonService,
  ) {}

  ngOnInit(): void {
    this.createLessonForm = this.formBuilder.group({
      lessonName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
    })
  }

  submitForm() {
    if (this.createLessonForm.invalid) {
      return
    }

    this.isLoading = true

    this.createLessonForm.disable()

    const creatingLesson: CreatingLesson = {
      ...this.createLessonForm.value,
    }

    this.lessonService
      .createLesson(creatingLesson)
      .pipe(take(1), shareReplay())
      .subscribe((lesson) => {
        this.isLoading = false
        this.createLessonForm.reset()
        this.createLessonForm.enable()

        this.alertService.sendMessage({
          alertTitle: 'Başarılı',
          alertContent: `${lesson.lessonName} adlı ders oluşturuldu.`,
          alertType: 'success',
        })
      })
  }

  clearForm() {
    this.createLessonForm.reset()
  }
}
