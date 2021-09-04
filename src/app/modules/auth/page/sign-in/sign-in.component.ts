import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { fuseAnimations } from '@fuse/animations'
import { FuseAlertType } from '@fuse/components/alert'

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
    private _activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      email: [
        'hughes.brian@company.com',
        [Validators.required, Validators.email],
      ],
      password: ['admin', Validators.required],
      rememberMe: [''],
    })
  }

  signIn(): void {}
}
