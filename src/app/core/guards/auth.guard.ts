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
export class AuthGuard implements CanActivate {
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
        if (status === false) {
          return of(this.router.createUrlTree(['/oturum/giris']))
        }

        return of(true)
      }),
    )
    // if (this.authService.check() === false) {
    //   return this.router.createUrlTree(['/oturum/giris'])
    // } else {
    //   const scopes = 'profile:manage'
    //   return this.authService.refreshingToken(scopes).pipe(
    //     exhaustMap((loginResponse: LoginResponse) => {
    //       if (
    //         !loginResponse.accessToken ||
    //         loginResponse.accessToken.trim().length == 0
    //       ) {
    //         this.authService.logout()
    //         return of(this.router.createUrlTree(['/oturum/giris']))
    //       }

    //       return of(true)
    //     }),
    //     catchError((err) => {
    //       console.log(err)
    //       return of(false)
    //     }),
    //   )
    //   // return this.authService.accessToken$.pipe(
    //   //   merge(
    //   //     this.authService
    //   //       .refreshingToken('profile:manage')
    //   //       .pipe(map((response: LoginResponse) => response.accessToken)),
    //   //   ),
    //   //   exhaustMap((accessToken) => {
    //   //     if (!accessToken || accessToken.trim().length == 0) {
    //   //       this.authService.logout()
    //   //       return of(this.router.createUrlTree(['/oturum/giris']))
    //   //     }

    //   //     return of(true)
    //   //   }),
    // }
  }
}
