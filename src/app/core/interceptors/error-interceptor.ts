import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { AlertService } from '@app/alert/alert.service'
import { Observable, throwError } from 'rxjs'
import { catchError, finalize, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private alertService: AlertService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let ok: string
    return next.handle(req).pipe(
      tap(
        (event) => (ok = event instanceof HttpResponse ? 'succeeded' : ''),
        (error) => {
          ok = 'failed'
          console.log(error)
        },
      ),
      finalize(() => {
        if (ok !== 'succeeded') {
          this.alertService.sendMessage({
            alertTitle: 'Hay aksi',
            alertContent: 'Bir şeyler ters gitti',
            alertType: 'error',
          })
        }
        console.log('The request has been finalized as', ok)
      }),
      catchError((err) => {
        return throwError({
          error: { code: -1, message: err ? err : 'Unexcepted error' },
        })
      }),
    )
  }
}
