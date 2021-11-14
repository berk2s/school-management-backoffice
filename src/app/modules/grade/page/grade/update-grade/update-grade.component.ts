import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AlertService } from '@app/alert/alert.service'
import { SubDrawerLayoutComponent } from '@layouts/sub-drawer-layout/sub-drawer-layout.component'
import { Subject } from 'rxjs'
import { map, pluck, shareReplay, take, takeUntil } from 'rxjs/operators'
import { GradeCategory } from 'src/app/data/grade-category/types/grade-category.types'
import { GradeService } from 'src/app/data/grade/service/grade.service'
import { Grade, UpdatingGrade } from 'src/app/data/grade/types/grade.types'

@Component({
  selector: 'app-update-grade',
  templateUrl: './update-grade.component.html',
  styleUrls: ['./update-grade.component.scss'],
})
export class UpdateGradeComponent implements OnInit, OnDestroy {
  grade: Grade
  gradeCategories: GradeCategory[]

  updateGradeForm: FormGroup

  isLoading: boolean = false

  private _unsubscribeAll: Subject<any> = new Subject<any>()

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private gradeService: GradeService,
    private subDrawerLayoutComponent: SubDrawerLayoutComponent,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        map((data) => [data.grade, data.gradeCategories]),
        takeUntil(this._unsubscribeAll),
      )
      .subscribe(([grade, gradeCategories]: [Grade, GradeCategory[]]) => {
        if (!grade || !gradeCategories) {
          this.router.navigateByUrl('/organizasyon/subeler')
          this.alertService.sendMessage({
            alertTitle: 'Hay aksi',
            alertContent: 'Bir şeyler ters gitti, tekrar deneyiniz.',
            alertType: 'error',
          })
        } else {
          this.grade = grade
          this.gradeCategories = gradeCategories

          this.updateGradeForm = this.formBuilder.group({
            gradeName: [
              grade.gradeName,
              [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100),
              ],
            ],
            gradeCategoryId: [grade.gradeCategory?.gradeCategoryId, []],
          })
        }
      })
  }

  submitForm() {
    if (!this.updateGradeForm.valid) {
      return
    }

    let updatingGrade: UpdatingGrade = {}

    if (
      this.grade.gradeName !==
      this.updateGradeForm.controls['gradeName'].value.trim()
    ) {
      updatingGrade = {
        ...updatingGrade,
        gradeName: this.updateGradeForm.controls['gradeName'].value.trim(),
      }
    }

    if (
      this.grade.gradeCategory?.gradeCategoryId !==
      (this.updateGradeForm.controls['gradeCategoryId'].value as number)
    ) {
      updatingGrade = {
        ...updatingGrade,
        newGradeCategoryId: this.updateGradeForm.controls['gradeCategoryId']
          .value as number,
      }
    }

    if (Object.keys(updatingGrade).length > 0) {
      this.isLoading = true

      this.updateGradeForm.disable()

      this.gradeService
        .updateGrade(this.grade.gradeId, updatingGrade)
        .pipe(take(1), shareReplay())
        .subscribe(() => {
          this.isLoading = false
          this.updateGradeForm.enable()

          this.alertService.sendMessage({
            alertTitle: 'Başarılı',
            alertContent: `Şube başarılı bir şekilde düzenlendi`,
            alertType: 'success',
          })
        })
    }
  }

  toggleDrawer() {
    this.subDrawerLayoutComponent.matDrawer.toggle()
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next()
    this._unsubscribeAll.complete()
  }
}
