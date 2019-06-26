import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { UserAuthenticationQuery } from '../services/userAuthentication/userAuthentication.query';
import { Injectable } from '@angular/core';
import { RolesService } from '../services/rolesService/roles.service';

@Injectable()
export class AuthoriseRoleGuard implements CanActivate {
  constructor(
    private authQuery: UserAuthenticationQuery,
    private router: Router,
    private rolesService: RolesService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authQuery.isAuthenticated()) {
      return true;
    }

    // No authority, bye bye.
    this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
