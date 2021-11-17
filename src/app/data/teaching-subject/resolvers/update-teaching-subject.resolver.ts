import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router'
import { IdNormalizePipe } from '@shared/pipes/id-normalize.pipe'
import { of } from 'rxjs'
import { catchError, take } from 'rxjs/operators'
import { TeachingSubjectService } from '../service/teaching-subject.service'

@Injectable({
  providedIn: 'root',
})
export class UpdateTeachingSubjectResolver implements Resolve<any> {
  constructor(
    private teachingSubjectService: TeachingSubjectService,
    private idNormalizePipe: IdNormalizePipe,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const teachingSubjectId: number = this.idNormalizePipe.transform(
      route.params.teachingSubjectId,
    ) as number

    if (!teachingSubjectId) {
      return of(null)
    }

    return this.teachingSubjectService
      .getTeachingSubject(teachingSubjectId)
      .pipe(
        take(1),
        catchError(() => of(null)),
      )
  }
}
