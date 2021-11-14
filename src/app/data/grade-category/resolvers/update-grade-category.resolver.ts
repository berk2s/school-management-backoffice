import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router'
import { IdNormalizePipe } from '@shared/pipes/id-normalize.pipe'
import { of } from 'rxjs'
import { catchError, shareReplay, take } from 'rxjs/operators'
import { GradeCategoryService } from '../service/grade-category.service'

@Injectable({
  providedIn: 'root',
})
export class UpdateGradeCategoryResolver implements Resolve<any> {
  constructor(
    private gradeCategoryService: GradeCategoryService,
    private idNormalizePipe: IdNormalizePipe,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const gradeCategoryId: number = this.idNormalizePipe.transform(
      route.params.gradeCategoryId,
    ) as number

    if (!gradeCategoryId) {
      return of(null)
    }

    return this.gradeCategoryService.getGradeCategory(gradeCategoryId).pipe(
      take(1),
      shareReplay(),
      catchError(() => of(null)),
    )
  }
}
