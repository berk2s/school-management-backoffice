import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of, ReplaySubject } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Navigation } from '@app/navigation/navigation.types'
import {
  defaultNavigation,
  compactNavigation,
  futuristicNavigation,
  horizontalNavigation,
} from './navigation.data'
import { cloneDeep } from 'lodash'

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private _navigation: ReplaySubject<Navigation> = new ReplaySubject<
    Navigation
  >(1)

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for navigation
   */
  get navigation$(): Observable<Navigation> {
    return this._navigation.asObservable()
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get all navigation data
   */
  get(): Observable<Navigation> {
    compactNavigation.forEach((compactNavItem) => {
      defaultNavigation.forEach((defaultNavItem) => {
        if (defaultNavItem.id === compactNavItem.id) {
          compactNavItem.children = cloneDeep(defaultNavItem.children)
        }
      })
    })

    // Fill futuristic navigation children using the default navigation
    futuristicNavigation.forEach((futuristicNavItem) => {
      defaultNavigation.forEach((defaultNavItem) => {
        if (defaultNavItem.id === futuristicNavItem.id) {
          futuristicNavItem.children = cloneDeep(defaultNavItem.children)
        }
      })
    })

    // Fill horizontal navigation children using the default navigation
    horizontalNavigation.forEach((horizontalNavItem) => {
      defaultNavigation.forEach((defaultNavItem) => {
        if (defaultNavItem.id === horizontalNavItem.id) {
          horizontalNavItem.children = cloneDeep(defaultNavItem.children)
        }
      })
    })

    const navigation: Navigation = {
      compact: compactNavigation,
      default: defaultNavigation,
      futuristic: futuristicNavigation,
      horizontal: horizontalNavigation,
    }

    return of(navigation)
  }
}
