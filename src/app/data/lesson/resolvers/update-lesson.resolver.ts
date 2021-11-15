import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router'
import { IdNormalizePipe } from '@shared/pipes/id-normalize.pipe'
import { of } from 'rxjs'
import { catchError, take } from 'rxjs/operators'
import { LessonService } from '../service/lesson.service'

@Injectable({
  providedIn: 'root',
})
export class UpdateLessonResolver implements Resolve<any> {
  constructor(
    private lessonService: LessonService,
    private idNormalizePipe: IdNormalizePipe,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const lessonId: number = this.idNormalizePipe.transform(
      route.params.lessonId,
    ) as number

    if (!lessonId) {
      return of(null)
    }

    return this.lessonService.getLesson(lessonId).pipe(
      take(1),
      catchError(() => of(null)),
    )
  }
}
