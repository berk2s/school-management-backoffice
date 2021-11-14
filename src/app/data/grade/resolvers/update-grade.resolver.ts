import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router'
import { IdNormalizePipe } from '@shared/pipes/id-normalize.pipe'
import { of } from 'rxjs'
import { catchError, take } from 'rxjs/operators'
import { GradeService } from '../service/grade.service'

@Injectable({
  providedIn: 'root',
})
export class UpdateGradeResolver implements Resolve<any> {
  constructor(
    private gradeService: GradeService,
    private idNormalize: IdNormalizePipe,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const gradeId: number = this.idNormalize.transform(
      route.params.gradeId,
    ) as number

    if (gradeId === null) {
      return of(null)
    }

    return this.gradeService.getGrade(gradeId).pipe(
      take(1),
      catchError(() => of(null)),
    )
  }
}
