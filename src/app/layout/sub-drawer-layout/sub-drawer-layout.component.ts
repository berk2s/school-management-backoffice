import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatDrawer } from '@angular/material/sidenav'
import { ActivatedRoute } from '@angular/router'
import { FuseNavigationItem } from '@fuse/components/navigation'
import { FuseMediaWatcherService } from '@fuse/services/media-watcher'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-sub-drawer-layout',
  templateUrl: './sub-drawer-layout.component.html',
  styleUrls: ['./sub-drawer-layout.component.scss'],
})
export class SubDrawerLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer

  menuData: FuseNavigationItem[]

  drawerMode: 'over' | 'side' = 'side'
  drawerOpened: boolean = true

  private _unsubscribeAll: Subject<any> = new Subject<any>()

  constructor(
    private activatedRoute: ActivatedRoute,
    private fuseMediaWatcherService: FuseMediaWatcherService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.menuData = data.menuData
      })

    this.fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'side'
          this.drawerOpened = true
        } else {
          this.drawerMode = 'over'
          this.drawerOpened = false
        }
      })
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next()
    this._unsubscribeAll.complete()
  }
}
