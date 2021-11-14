import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AlertService } from '@app/alert/alert.service'
import { SubDrawerLayoutComponent } from '@layouts/sub-drawer-layout/sub-drawer-layout.component'
import { Subject } from 'rxjs'
import { pluck, shareReplay, take, takeUntil } from 'rxjs/operators'
import { GradeCategory } from 'src/app/data/grade-category/types/grade-category.types'
import { GradeService } from 'src/app/data/grade/service/grade.service'
import { CreatingGrade } from 'src/app/data/grade/types/grade.types'

@Component({
  selector: 'app-create-grade',
  templateUrl: './create-grade.component.html',
  styleUrls: ['./create-grade.component.scss'],
})
export class CreateGradeComponent implements OnInit, OnDestroy {
  gradeCategories: GradeCategory[]

  createGradeForm: FormGroup

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
      .pipe(pluck('gradeCategories'), takeUntil(this._unsubscribeAll))
      .subscribe((gradeCategories: GradeCategory[]) => {
        if (!gradeCategories) {
          this.router.navigateByUrl('../')
          this.alertService.sendMessage({
            alertTitle: 'Hay aksi',
            alertContent: 'Bir şeyler ters gitti, tekrar deneyiniz.',
            alertType: 'error',
          })
        } else {
          this.gradeCategories = gradeCategories
        }
      })

    this.createGradeForm = this.formBuilder.group({
      gradeName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
      gradeCategoryId: [, [Validators.required]],
    })
  }

  submitForm() {
    if (!this.createGradeForm.valid) {
      return
    }

    this.isLoading = true
    this.createGradeForm.disable()

    const creatingGrade: CreatingGrade = {
      ...this.createGradeForm.value,
    }

    this.gradeService
      .createGrade(creatingGrade)
      .pipe(take(1), shareReplay())
      .subscribe((grade) => {
        this.isLoading = false
        this.createGradeForm.reset()
        this.createGradeForm.enable()

        this.alertService.sendMessage({
          alertTitle: 'Başarılı',
          alertContent: `${grade.gradeName} adlı şube oluşturuldu.`,
          alertType: 'success',
        })
      })
  }

  clearForm() {
    this.createGradeForm.reset()
  }

  toggleDrawer() {
    this.subDrawerLayoutComponent.matDrawer.toggle()
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next()
    this._unsubscribeAll.complete()
  }
}
