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
import { ScopeService } from 'src/app/data/scope/service/scope.service'
import { TokenService } from 'src/app/data/token/service/token.service'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenService: TokenService,
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

    return this.tokenService.checkPermission(scope).pipe(
      exhaustMap((status) => {
        if (status === false) {
          return of(this.router.createUrlTree(['/oturum/giris']))
        }

        return of(true)
      }),
    )
  }
}
