import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AlertService } from '@app/alert/alert.service'
import { shareReplay, take } from 'rxjs/operators'
import { TeachingSubjectService } from 'src/app/data/teaching-subject/service/teaching-subject.service'
import {
  CreatingTeachingSubject,
  TeachingSubject,
} from 'src/app/data/teaching-subject/types/teaching-subject.types'

@Component({
  selector: 'app-create-teaching-subject',
  templateUrl: './create-teaching-subject.component.html',
  styleUrls: ['./create-teaching-subject.component.scss'],
})
export class CreateTeachingSubjectComponent implements OnInit {
  createTeachingSubjectForm: FormGroup

  isLoading: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private teahcingSubjectService: TeachingSubjectService,
  ) {}

  ngOnInit(): void {
    this.createTeachingSubjectForm = this.formBuilder.group({
      subjectName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(99),
        ],
      ],
    })
  }

  submitForm() {
    if (this.createTeachingSubjectForm.invalid) {
      return
    }

    this.isLoading = true
    this.createTeachingSubjectForm.disable()

    const creatingTeachingSubject: CreatingTeachingSubject = {
      ...this.createTeachingSubjectForm.value,
    }

    this.teahcingSubjectService
      .createTeachingSubject(creatingTeachingSubject)
      .pipe(take(1), shareReplay())
      .subscribe((teachingSubject: TeachingSubject) => {
        this.isLoading = false
        this.createTeachingSubjectForm.reset()
        this.createTeachingSubjectForm.enable()

        this.alertService.sendMessage({
          alertTitle: 'Başarılı',
          alertContent: `${teachingSubject.subjectName} adlı branş oluşturuldu.`,
          alertType: 'success',
        })
      })
  }

  clearForm() {
    this.createTeachingSubjectForm.reset()
  }
}
