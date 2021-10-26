import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env'
import { Observable, ReplaySubject, Subject } from 'rxjs'
import { shareReplay, tap } from 'rxjs/operators'
import { User } from '../types/user.types'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: Subject<User> = new ReplaySubject(1)

  constructor(private httpClient: HttpClient) {}

  getUserInfo(): Observable<User> {
    return this.httpClient.get<User>(environment.api.userInfoUrl).pipe(
      tap((user: User) => this.user.next(user)),
      shareReplay(),
    )
  }
}
