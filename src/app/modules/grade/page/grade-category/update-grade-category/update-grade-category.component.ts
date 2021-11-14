import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AlertService } from '@app/alert/alert.service'
import { SubDrawerLayoutComponent } from '@layouts/sub-drawer-layout/sub-drawer-layout.component'
import { Subject } from 'rxjs'
import { pluck, shareReplay, take, takeUntil } from 'rxjs/operators'
import { GradeCategoryService } from 'src/app/data/grade-category/service/grade-category.service'
import {
  GradeCategory,
  UpdatingGradeCategory,
} from 'src/app/data/grade-category/types/grade-category.types'

@Component({
  selector: 'app-update-grade-category',
  templateUrl: './update-grade-category.component.html',
  styleUrls: ['./update-grade-category.component.scss'],
})
export class UpdateGradeCategoryComponent implements OnInit, OnDestroy {
  gradeCategory: GradeCategory

  updateGradeCategoryForm: FormGroup

  isLoading: boolean = false

  private _unsubscribeAll: Subject<any> = new Subject<any>()

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private gradeCategoryService: GradeCategoryService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private subDrawerLayoutComponent: SubDrawerLayoutComponent,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(pluck('gradeCategory'), takeUntil(this._unsubscribeAll))
      .subscribe((gradeCategory: GradeCategory | null) => {
        if (!gradeCategory) {
          this.router.navigateByUrl('/organizasyon/kategoriler')
          this.alertService.sendMessage({
            alertTitle: 'Hay aksi',
            alertContent: 'Bir şeyler ters gitti, tekrar deneyiniz.',
            alertType: 'error',
          })
        } else {
          this.gradeCategory = gradeCategory

          this.updateGradeCategoryForm = this.formBuilder.group({
            gradeCategoryName: [
              gradeCategory.gradeCategoryName,
              [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100),
              ],
            ],
          })
        }
      })
  }

  updateMetaInfos() {
    if (this.updateGradeCategoryForm.invalid) {
      return
    }

    let updatingGradeCategory: UpdatingGradeCategory = {}

    if (
      this.gradeCategory.gradeCategoryName !==
      this.updateGradeCategoryForm.controls['gradeCategoryName'].value.trim()
    ) {
      updatingGradeCategory = {
        ...updatingGradeCategory,
        gradeCategoryName: this.updateGradeCategoryForm.controls[
          'gradeCategoryName'
        ].value.trim(),
      }
    }

    if (Object.keys(updatingGradeCategory).length > 0) {
      this.isLoading = true

      this.updateGradeCategoryForm.disable()

      this.gradeCategoryService
        .updateGradeCategory(
          this.gradeCategory.gradeCategoryId,
          updatingGradeCategory,
        )
        .pipe(take(1), shareReplay())
        .subscribe(() => {
          this.isLoading = false

          this.updateGradeCategoryForm.enable()

          this.alertService.sendMessage({
            alertTitle: 'Başarılı',
            alertContent: 'Şube kategorisi başarılı şekilde güncellendi.',
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
