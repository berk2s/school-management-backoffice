import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env'
import { combineLatest, Observable } from 'rxjs'
import { exhaustMap, take } from 'rxjs/operators'
import { TokenService } from 'src/app/data/token/service/token.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (
      req.url.startsWith(environment.api.loginUrl) ||
      !req.url.startsWith('http://')
    ) {
      return next.handle(req)
    }

    return combineLatest([this.tokenService.accessToken]).pipe(
      take(1),
      exhaustMap((data) => {
        const accessToken = data[0]
        const authenticatedRequest = req.clone({
          headers: req.headers.set(`Authorization`, `Bearer ${accessToken}`),
        })

        return next.handle(authenticatedRequest)
      }),
    )
  }
}
