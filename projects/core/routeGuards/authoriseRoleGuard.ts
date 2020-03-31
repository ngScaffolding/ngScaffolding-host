import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';
import { RolesService } from '../services/rolesService/roles.service';
import { UserAuthenticationBase } from '../services/userAuthentication';

@Injectable()
export class AuthoriseRoleGuard implements CanActivate {
  constructor(
    private authService: UserAuthenticationBase,
    private router: Router,
    private rolesService: RolesService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this.authService.isAuthenticated()) {
      return true;
    }

    // No authority, bye bye.
    // this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
    this.authService.forceLogon();
    return false;

    // return true;
  }
}
