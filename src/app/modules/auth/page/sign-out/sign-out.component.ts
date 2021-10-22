import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { Router } from '@angular/router'
import { interval, Subscription } from 'rxjs'
import { AuthService } from 'src/app/data/auth/service/auth.service'

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SignOutComponent implements OnInit, OnDestroy {
  _countdown: number = 3
  countdown: number = 3
  countdown$: Subscription

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.logout()

    this.countdown$ = interval(1000).subscribe((val) => {
      this.countdown -= 1

      if (val > this._countdown) {
        this.router.navigateByUrl('/oturum/giris')
      }
    })
  }

  ngOnDestroy(): void {
    this.countdown$.unsubscribe()
  }
}
