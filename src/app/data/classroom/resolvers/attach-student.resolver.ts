import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router'
import { forkJoin, of } from 'rxjs'
import { catchError, take } from 'rxjs/operators'
import { StudentService } from '../../student/service/student.service'
import { ClassroomService } from '../service/classroom.service'

@Injectable({
  providedIn: 'root',
})
export class AttachStudentResolver implements Resolve<any> {
  constructor(
    private studentService: StudentService,
    private classRoomService: ClassroomService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return forkJoin([
      this.classRoomService.getClassrooms(0, 100000).pipe(
        take(1),
        catchError(() => of(null)),
      ),
      this.studentService.getStudents(0, 10000).pipe(
        take(1),
        catchError(() => of(null)),
      ),
    ])
  }
}
