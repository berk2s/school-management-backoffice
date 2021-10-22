import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { fuseAnimations } from '@fuse/animations'
import { FuseAlertType } from '@fuse/components/alert'
import { map } from 'rxjs/operators'
import { AuthService } from 'src/app/data/auth/service/auth.service'
import { LoginRequest } from 'src/app/data/auth/types/auth.types'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SignInComponent implements OnInit {
  @ViewChild('signInNgForm') signInNgForm: NgForm | undefined

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  }

  signInForm: FormGroup | undefined
  showAlert: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      username: ['username', [Validators.required]],
      password: ['password', Validators.required],
      rememberMe: [false],
    })
  }

  signIn(): void {
    if (this.signInForm.invalid) {
      return
    }

    this.signInForm.disable()

    const loginRequest: LoginRequest = {
      username: this.signInForm.get('username').value,
      password: this.signInForm.get('password').value,
      scopes: 'profile:manage manage:announcements',
      rememberMe: this.signInForm.get('rememberMe').value,
    }

    this.authService.login(loginRequest).subscribe(
      (res) => {
        this.showAlert = true
        this.alert = {
          type: 'success',
          message: 'Giriş başarılı, lütfen bekleyiniz...',
        }

        this.router.navigateByUrl('/anasayfa')
      },
      (err) => {
        this.showAlert = true
        this.alert = {
          type: 'error',
          message: err.error.code,
        }
        this.signInForm.enable()
      },
      () => {
        this.signInForm.enable()
      },
    )
  }
}
