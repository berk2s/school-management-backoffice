import { Injectable } from '@angular/core'
import { scopesData } from '../data/scope.data'

@Injectable({
  providedIn: 'root',
})
export class ScopeService {
  getScope(url: string): string {
    const data = scopesData
      .filter((data) => data.url === url)
      .map((data) => data.scope)
    return data[0]
  }
}
