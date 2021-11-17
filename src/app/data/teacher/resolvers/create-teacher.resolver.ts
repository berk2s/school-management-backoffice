import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router'
import { of } from 'rxjs'
import { catchError, take } from 'rxjs/operators'
import { TeachingSubjectService } from '../../teaching-subject/service/teaching-subject.service'

@Injectable({
  providedIn: 'root',
})
export class CreateTeacherResolver implements Resolve<any> {
  constructor(private teachingSubjectService: TeachingSubjectService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.teachingSubjectService.getTeachingSubjects().pipe(
      take(1),
      catchError(() => of(null)),
    )
  }
}
