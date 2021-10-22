import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router'
import { Observable, of } from 'rxjs'
import { exhaustMap } from 'rxjs/operators'
import { AuthService } from 'src/app/data/auth/service/auth.service'
import { ScopeService } from 'src/app/data/scope/service/scope.service'

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private scopeService: ScopeService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const scope = this.scopeService.getScope(route.routeConfig.path)

    return this.authService.check(scope).pipe(
      exhaustMap((status) => {
        if (status === true) {
          return of(this.router.createUrlTree(['/anasayfa']))
        } else {
          return of(true)
        }
      }),
    )
  }
}
