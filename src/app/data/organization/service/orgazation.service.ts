import { Injectable } from '@angular/core'
import { ReplaySubject, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private organizationId: Subject<number> = new ReplaySubject(1)

  constructor() {}

  setOrganizationId(organizationId: number) {
    console.log("I'm changed but it may be same then value as before")

    this.organizationId.next(organizationId)
  }

  get organizationId$() {
    return this.organizationId.asObservable()
  }
}
