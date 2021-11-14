import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router'
import { of } from 'rxjs'
import { catchError, take } from 'rxjs/operators'
import { GradeCategoryService } from '../../grade-category/service/grade-category.service'

@Injectable({
  providedIn: 'root',
})
export class CreateGradeResolver implements Resolve<any> {
  constructor(private gradeCategoryService: GradeCategoryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.gradeCategoryService.getAllGradeCategories().pipe(
      take(1),
      catchError(() => of(null)),
    )
  }
}
