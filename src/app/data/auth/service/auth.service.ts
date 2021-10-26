import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { TokenService } from '../../token/service/token.service'
import { LoginResponse } from '../../token/types/token.types'
import { LoginRequest } from '../types/login.types'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService,
  ) {}

  login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.loginRequest(loginData).pipe(
      tap((tokens) => {
        this.tokenService.saveTokens(tokens)
      }),
    )
  }

  private loginRequest(loginData: LoginRequest) {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    }

    return this.httpClient
      .post<LoginResponse>(environment.api.loginUrl, loginData, options)
      .pipe(
        map((response: any) => {
          return {
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            expiresIn: response.expires_in,
            scopes: loginData?.scopes as string,
          }
        }),
      )
  }

  logout() {
    this.tokenService.clearTokens()
  }
}
