import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AlertService } from '@app/alert/alert.service'
import { fuseAnimations } from '@fuse/animations'
import { FuseAlertType } from '@fuse/components/alert'
import { Subject, Subscription } from 'rxjs'
import { distinctUntilChanged, takeUntil } from 'rxjs/operators'
import { TokenService } from './data/token/service/token.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: fuseAnimations,
})
export class AppComponent implements OnInit, OnDestroy {
  alertTitle: string = ''
  alertContent: string = ''
  alertType: FuseAlertType = 'basic'
  showAlert = false
  slideState = '*'

  alertSubscription: Subscription

  title = 'school-management-backoffice'

  private _unsubscribeAll: Subject<any> = new Subject()

  constructor(
    private router: Router,
    private alertService: AlertService,
    private tokenService: TokenService,
  ) {
    //this.router.navigateByUrl('/anasayfa')
  }

  ngOnInit(): void {
    this.tokenService
      .scheduleRefreshing()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        if (data !== false) {
          console.log('Token has been refreshed')
        }
      })

    this.alertService.alert$
      .pipe(
        takeUntil(this._unsubscribeAll),
        distinctUntilChanged(
          (prev, curr) => prev.alertTitle === this.alertTitle,
        ),
      )
      .subscribe(({ alertTitle, alertContent, alertType }) => {
        this.alertTitle = alertTitle
        this.alertContent = alertContent
        this.alertType = alertType
        this.showAlert = true
        this.slideState = '*'

        setTimeout(() => {
          this.slideState = 'void'
          this.showAlert = false
          this.alertTitle = ''
          this.alertContent = ''
          this.alertType = 'basic'
          this.showAlert = false
        }, 3000)
      })
  }

  ngOnDestroy(): void {
    console.log('heree')

    this._unsubscribeAll.next()
    this._unsubscribeAll.complete()
  }
}
