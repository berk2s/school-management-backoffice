import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { FuseMediaWatcherService } from '@fuse/services/media-watcher'
import {
  FuseNavigationService,
  FuseVerticalNavigationComponent,
} from '@fuse/components/navigation'
import { Navigation } from '@app/navigation/navigation.types'
import { NavigationService } from '@app/navigation/navigation.service'

@Component({
  selector: 'app-classic-layout',
  templateUrl: './classic-layout.component.html',
  styleUrls: ['./classic-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClassicLayoutComponent implements OnInit, OnInit {
  isScreenSmall: boolean
  navigation: Navigation = {
    default: [],
    compact: [],
    horizontal: [],
    futuristic: [],
  }
  private _unsubscribeAll: Subject<any> = new Subject<any>()

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _navigationService: NavigationService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseNavigationService: FuseNavigationService,
  ) {}

  get currentYear(): number {
    return new Date().getFullYear()
  }

  ngOnInit(): void {
    this._navigationService
      .get()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((navigation: Navigation) => {
        this.navigation = navigation
      })

    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md')
      })
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next()
    this._unsubscribeAll.complete()
  }

  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation = this._fuseNavigationService.getComponent<
      FuseVerticalNavigationComponent
    >(name)

    if (navigation) {
      // Toggle the opened status
      navigation.toggle()
    }
  }
}
