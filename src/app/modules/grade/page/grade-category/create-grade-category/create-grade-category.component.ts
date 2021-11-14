import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AlertService } from '@app/alert/alert.service'
import { SubDrawerLayoutComponent } from '@layouts/sub-drawer-layout/sub-drawer-layout.component'
import { shareReplay, take } from 'rxjs/operators'
import { GradeCategoryService } from 'src/app/data/grade-category/service/grade-category.service'
import { CreatingGradeCategory } from 'src/app/data/grade-category/types/grade-category.types'

@Component({
  selector: 'app-create-grade-category',
  templateUrl: './create-grade-category.component.html',
  styleUrls: ['./create-grade-category.component.scss'],
})
export class CreateGradeCategoryComponent implements OnInit {
  createGradeCategoryForm: FormGroup

  isLoading: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private gradeCategoryService: GradeCategoryService,
    private alertService: AlertService,
    private subDrawerLayoutComponent: SubDrawerLayoutComponent,
  ) {}

  ngOnInit(): void {
    this.createGradeCategoryForm = this.formBuilder.group({
      gradeCategoryName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
    })
  }

  submitForm() {
    if (!this.createGradeCategoryForm.valid) {
      return
    }

    this.isLoading = true

    this.createGradeCategoryForm.disable()

    const creatingGradeCategory: CreatingGradeCategory = {
      ...this.createGradeCategoryForm.value,
    }

    this.gradeCategoryService
      .createGradeCategory(creatingGradeCategory)
      .pipe(take(1), shareReplay())
      .subscribe((gradeCategory) => {
        this.isLoading = false
        this.createGradeCategoryForm.reset()
        this.createGradeCategoryForm.enable()

        this.alertService.sendMessage({
          alertTitle: 'Başarılı',
          alertContent: `${gradeCategory.gradeCategoryName} adlı şube kategorisi oluşturuldu.`,
          alertType: 'success',
        })
      })
  }

  toggleDrawer() {
    this.subDrawerLayoutComponent.matDrawer.toggle()
  }

  clearForm() {
    this.createGradeCategoryForm.reset()
  }
}
