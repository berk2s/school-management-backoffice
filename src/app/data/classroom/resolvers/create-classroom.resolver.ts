import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router'
import { forkJoin, merge, of } from 'rxjs'
import { catchError, map, take } from 'rxjs/operators'
import { GradeService } from '../../grade/service/grade.service'
import { TeacherService } from '../../teacher/service/teacher.service'

@Injectable({
  providedIn: 'root',
})
export class CreateClassroomResolver implements Resolve<any> {
  constructor(
    private gradeService: GradeService,
    private teacherService: TeacherService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return forkJoin([
      this.gradeService.getGrades(0, 10000).pipe(
        take(1),
        catchError(() => of(null)),
      ),
      this.teacherService.getTeachers(0, 10000).pipe(
        take(1),
        catchError(() => of(null)),
      ),
    ])
  }
}
