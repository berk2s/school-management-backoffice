import { Component, OnDestroy, OnInit } from '@angular/core'
import { AlertService } from '@app/alert/alert.service'
import { fuseAnimations } from '@fuse/animations'
import { FuseAlertType } from '@fuse/components/alert'
import { Subscription } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'

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

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertSubscription = this.alertService.alert$
      .pipe(
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
        }, 2000)
      })
  }

  ngOnDestroy(): void {
    this.alertSubscription.unsubscribe()
  }
}
