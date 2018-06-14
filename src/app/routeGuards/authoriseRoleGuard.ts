import { CanActivate, Router } from '@angular/router';
import { UserAuthorisationService } from '../../modules/core/coreModule';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthoriseRoleGuard implements CanActivate {
  constructor(
    private authService: UserAuthorisationService,
    private router: Router
  ) {}

  canActivate() {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // No authority, bye bye.
    this.router.navigate(['login']);
    return false;
  }
}
