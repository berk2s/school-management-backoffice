import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env'
import {
  BehaviorSubject,
  combineLatest,
  interval,
  Observable,
  of,
  throwError,
} from 'rxjs'
import {
  catchError,
  exhaustMap,
  map,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators'
import { OrganizationService } from '../../organization/service/orgazation.service'
import { UserService } from '../../user/service/user.service'
import { TokenResponse } from '../types/token.types'

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  accessToken: BehaviorSubject<string> = new BehaviorSubject(null)

  private refreshToken: BehaviorSubject<string> = new BehaviorSubject(null)

  private expiresIn: BehaviorSubject<number> = new BehaviorSubject(null)

  private scopes: BehaviorSubject<string> = new BehaviorSubject(null)

  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    private organizationService: OrganizationService,
  ) {}

  refreshTokens(scope = 'profile:manage'): Observable<TokenResponse> {
    this.scopes.next(scope ? scope : 'profile:manage')

    return combineLatest([this.refreshToken, this.scopes]).pipe(
      take(1),
      exhaustMap((data) => {
        let refreshToken = data[0]
        const scopes = data[1]

        if (!refreshToken || refreshToken.trim() === '') {
          const _refreshToken = localStorage.getItem('refreshToken')
          if (!_refreshToken) {
            return throwError('Refresh Token is not valid or available.')
          } else {
            refreshToken = _refreshToken
          }
        }

        return this.refreshTokenRequest(refreshToken, scopes)
      }),
      tap(
        (tokens) => {
          this.saveTokens(tokens)
        },
        () => {
          this.clearTokens()
        },
      ),
    )
  }

  saveTokens(tokenResponse: TokenResponse): void {
    const { accessToken, refreshToken, expiresIn, scopes } = tokenResponse

    localStorage.setItem('refreshToken', refreshToken)

    this.accessToken.next(accessToken)
    this.refreshToken.next(refreshToken)
    this.expiresIn.next(expiresIn)
    this.scopes.next(scopes)

    this.userService
      .getUserInfo()
      .pipe(take(1))
      .subscribe((userInfo) => {
        this.organizationService.setOrganizationId(
          userInfo.organization.organizationId,
        )
      })
  }

  checkTokens(scope: string): Observable<boolean> {
    return combineLatest([this.accessToken, this.scopes]).pipe(
      take(1),
      exhaustMap((data) => {
        const accessToken = data[0]
        const scopes = data[1]

        if (!accessToken || accessToken.trim() == '') {
          return this.refreshTokens(scope ? scope : scopes).pipe(
            switchMap(() => {
              return of(true)
            }),
            catchError(() => {
              return of(false)
            }),
          )
        }

        return this.checkAccessTokenRequest()
      }),
    )
  }

  private checkAccessTokenRequest() {
    return combineLatest([this.accessToken]).pipe(
      take(1),
      exhaustMap((data) => {
        const accessToken = data[0]

        const options = {
          headers: new HttpHeaders().set(
            'Content-Type',
            'application/x-www-form-urlencoded',
          ),
        }

        const params = new HttpParams()
          .set('client_id', 'mobile')
          .set('grant_type', 'check_token')
          .set('access_token', accessToken)

        return this.httpClient
          .post(environment.api.tokenUrl, params, options)
          .pipe(
            exhaustMap((res: any) => {
              return of(true)
            }),
            catchError(() => of(false)),
          )
      }),
    )
  }

  private refreshTokenRequest(refreshToken: string, scopes: string) {
    const params = new HttpParams()
      .set('client_id', 'backoffice')
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken)
      .set('scopes', scopes)

    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded',
      ),
    }

    return this.httpClient
      .post<TokenResponse>(environment.api.tokenUrl, params, options)
      .pipe(
        map((response: any) => {
          return {
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            expiresIn: response.expires_in,
            scopes: response?.scopes,
          }
        }),
      )
  }

  scheduleRefreshing() {
    return this.expiresIn.pipe(
      exhaustMap((expiresIn) => {
        if (expiresIn) {
          return interval(((expiresIn * 75) / 100) * 1000).pipe(
            withLatestFrom(this.scopes),
            exhaustMap((data) => {
              const scopes = data[1]
              return this.refreshTokens(scopes)
            }),
          )
        } else {
          return of(false)
        }
      }),
    )
  }

  clearTokens(): void {
    localStorage.removeItem('refreshToken')
    this.accessToken.next(null)
    this.refreshToken.next(null)
    this.accessToken.next(null)
    this.scopes.next(null)
  }

  get accessToken$() {
    return this.accessToken.asObservable()
  }

  get refreshToken$() {
    return this.refreshToken.asObservable()
  }

  get expiresIn$() {
    return this.expiresIn.asObservable()
  }

  get scopes$() {
    return this.scopes.asObservable()
  }
}
