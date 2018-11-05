import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { UserAuthorisationBase } from '../services/userAuthorisation/UserAuthorisationBase';
import { Injectable } from '@angular/core';
import { RolesService } from '../services/rolesService/roles.service';

@Injectable()
export class AuthoriseRoleGuard implements CanActivate {
  constructor(
    private authService: UserAuthorisationBase,
    private router: Router,
    private rolesService: RolesService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // No authority, bye bye.
    this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
