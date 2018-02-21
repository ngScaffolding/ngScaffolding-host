import { CanActivate } from '@angular/router';

export class AuthoriseRoleGuard implements CanActivate {
  canActivate() {
    console.log('AlwaysAuthGuard');
    return true;
  }
}
