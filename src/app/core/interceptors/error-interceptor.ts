import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { AlertService } from '@app/alert/alert.service'
import { Observable } from 'rxjs'
import { finalize, tap } from 'rxjs/operators'
import { translateMessage } from 'src/app/helper/error-response.helper'

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
          const translatedMessage = translateMessage(
            error.error ? (error.error.code ? error.error.code : -1) : -1,
          )
          if (translatedMessage.trim() !== 'Bilinmeyen bir hata') {
            this.alertService.sendMessage({
              alertTitle: 'Bir şeyler ters gitti',
              alertContent: translatedMessage,
              alertType: 'warning',
            })
          }
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
    )
  }
}
