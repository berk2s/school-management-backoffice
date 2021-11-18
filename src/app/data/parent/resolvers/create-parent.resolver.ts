import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router'
import { of } from 'rxjs'
import { catchError, shareReplay, take } from 'rxjs/operators'
import { StudentService } from '../../student/service/student.service'

@Injectable({
  providedIn: 'root',
})
export class CreateParentResolver implements Resolve<any> {
  constructor(private studentService: StudentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.studentService.getStudents(0, 10000).pipe(
      take(1),
      shareReplay(),
      catchError(() => of(null)),
    )
  }
}
