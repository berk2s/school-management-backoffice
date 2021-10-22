import { Injectable } from '@angular/core'
import { ReplaySubject, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private organizationId: Subject<number> = new ReplaySubject(1)

  constructor() {}

  setOrganizationId(organizationId: number) {
    this.organizationId.next(organizationId)
  }

  get organizationId$() {
    return this.organizationId.asObservable()
  }
}
