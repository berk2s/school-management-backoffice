import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserDropdownComponent implements OnInit, OnDestroy {
  constructor(private _router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  signOut(): void {
    this._router.navigate(['/oturum/cikis'])
  }
}
