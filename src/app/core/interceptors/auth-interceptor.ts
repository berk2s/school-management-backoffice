import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env'
import { concat, merge, Observable } from 'rxjs'
import { concatMap } from 'rxjs/operators'
import { AuthService } from 'src/app/data/auth/service/auth.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

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

    const accessToken = this.authService.accessToken$

    return accessToken.pipe(
      concatMap((accessToken: string) => {
        const authenticatedRequest = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + accessToken),
        })

        return next.handle(authenticatedRequest)
      }),
    )
  }
}
