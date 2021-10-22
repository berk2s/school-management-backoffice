import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { LoginRequest, LoginResponse, TokenRequest } from '../types/auth.types'
import { environment } from '@env'
import {
  catchError,
  delay,
  exhaustMap,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
} from 'rxjs/operators'
import {
  BehaviorSubject,
  Observable,
  of,
  Subject,
  Subscription,
  throwError,
} from 'rxjs'
import { UserService } from '../../user/service/user.service'
import { OrganizationService } from '../../organization/service/orgazation.service'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: BehaviorSubject<string | null> = new BehaviorSubject(
    null,
  )
  private refreshToken: BehaviorSubject<string | null> = new BehaviorSubject(
    null,
  )
  private expiresIn: BehaviorSubject<number | null> = new BehaviorSubject(null)

  private isLogged: BehaviorSubject<boolean | null> = new BehaviorSubject(null)

  private scopes: BehaviorSubject<string | null> = new BehaviorSubject(null)

  private scheduleRefreshing$: Subscription

  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    private organizationService: OrganizationService,
  ) {}

  login(data: LoginRequest) {
    const httpHeaders = new HttpHeaders()
    httpHeaders.set('Content-Type', 'application/json')

    return this.httpClient
      .post<LoginResponse>(environment.api.loginUrl, data, {
        headers: httpHeaders,
      })
      .pipe(
        map((res: any) => {
          if (
            res.access_token == null ||
            res.refresh_token == null ||
            res.expires_in == null
          ) {
            throw 'Unexcepted response'
          }

          return {
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
            expiresIn: res.expires_in,
          }
        }),
        tap(({ accessToken, refreshToken, expiresIn }) => {
          this.accessToken.next(accessToken)
          this.refreshToken.next(refreshToken)
          this.expiresIn.next(expiresIn)
          this.isLogged.next(true)
          this.scopes.next(data.scopes as string)
        }),
        tap((res) => this.save(res)),
        catchError((err) => {
          return throwError({
            error: { code: -1, message: err ? err : 'Unexcepted error' },
          })
        }),
      )
  }

  // TODO: when user logged and session has been expired, then still trying to refreshing token
  refreshingToken(
    scopes: string = 'profile:manage',
  ): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken()

    if (!refreshToken) {
      return this.isLogged$.pipe(
        switchMap((isLogged) => {
          if (isLogged) {
            this.logout()
          }
          return of({
            accessToken: null,
            refreshToken: null,
            expiresIn: null,
          })
        }),
      )
    }

    const params = new HttpParams()
      .set('client_id', 'backoffice')
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken)
      .set('scopes', scopes)

    return this.httpClient
      .post<LoginResponse>(environment.api.tokenUrl, params, {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded',
        ),
      })
      .pipe(
        map((res: any) => {
          if (
            res.access_token == null ||
            res.refresh_token == null ||
            res.expires_in == null
          ) {
            throw 'Unexcepted response'
          }

          return {
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
            expiresIn: res.expires_in,
          }
        }),
        tap(({ accessToken, refreshToken, expiresIn }) => {
          this.accessToken.next(accessToken)
          this.refreshToken.next(refreshToken)
          this.expiresIn.next(expiresIn)
          this.isLogged.next(true)
          this.scopes.next(scopes)
        }),
        tap((res) => this.save(res)),
      )
  }

  logout() {
    this.isLogged$
      .subscribe((status) => {
        if (status) {
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('expiresIn')
          this.accessToken.next(null)
          this.refreshToken.next(null)
          this.expiresIn.next(null)
          this.isLogged.next(false)
          this.scheduleRefreshing$.unsubscribe()
        }
      })
      .unsubscribe()
  }

  check(scopes: string = 'profile:manage'): Observable<boolean> {
    return this.accessToken$.pipe(
      exhaustMap((accessToken) => {
        if (!accessToken || accessToken.trim() == '') {
          return this.refreshingToken(scopes).pipe(
            exhaustMap((loginResponse: LoginResponse) => {
              if (
                !loginResponse.accessToken ||
                loginResponse.accessToken.trim().length == 0
              ) {
                this.logout()
                return of(false)
              }

              return of(true)
            }),
            catchError((err) => {
              this.logout()
              return of(false)
            }),
          )
        } else if (accessToken !== null) {
          return this.checkTokenRequest(accessToken)
        }
        return of(false)
      }),
    )
  }

  checkTokenRequest(accessToken: string) {
    const params = new HttpParams()
      .set('client_id', 'mobile')
      .set('grant_type', 'check_token')
      .set('access_token', accessToken)

    return this.httpClient
      .post(environment.api.tokenUrl, params, {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded',
        ),
      })
      .pipe(
        exhaustMap((res: any) => {
          return of(true)
        }),
        catchError(() => of(false)),
      )
  }

  save(loginResponse: LoginResponse) {
    const { accessToken, refreshToken, expiresIn } = loginResponse

    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('expiresIn', expiresIn.toString())

    if (this.scheduleRefreshing$) {
      this.scheduleRefreshing$.unsubscribe()
    }

    this.userService.getUserInfo().subscribe((user) => {
      const { organization } = user
      const { organizationId } = organization

      this.organizationService.setOrganizationId(organizationId)
    })

    this.scheduleRefreshing$ = this.scopes
      .pipe(
        delay(((expiresIn * 75) / 100) * 1000),
        exhaustMap((scopes) => {
          return this.refreshingToken(scopes)
        }),
        take(1),
      )
      .subscribe((_) => {})
  }

  getRefreshToken(): string {
    return localStorage.getItem('refreshToken')
  }

  get accessToken$(): Observable<string> {
    return this.accessToken.asObservable()
  }

  get refreshToken$() {
    return this.refreshToken.asObservable()
  }

  get expiresIn$() {
    return this.expiresIn.asObservable()
  }

  get isLogged$() {
    return this.isLogged.asObservable()
  }

  get scopes$() {
    return this.scopes.asObservable()
  }
}
