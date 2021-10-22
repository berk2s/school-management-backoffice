import { Injectable } from '@angular/core'
import { BehaviorSubject, ReplaySubject } from 'rxjs'
import { Alert } from './alert.types'

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alert: ReplaySubject<Alert> = new ReplaySubject(1)

  sendMessage(alert: Alert) {
    this.alert.next(alert)
  }

  get alert$() {
    return this.alert.asObservable()
  }
}
