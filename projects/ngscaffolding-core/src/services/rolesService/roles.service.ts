import { Injectable } from '@angular/core';
import { UserAuthorisationBase } from '../userAuthorisation/UserAuthorisationBase';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private routeRoles = new Map<string, string[]>();

  constructor(public userAuth: UserAuthorisationBase) {}

  // Checks if the current user is in this role.
  public isInRole(role: string): boolean {
    if (this.userAuth.currentUser && this.userAuth.currentUser.roles) {
      return this.userAuth.currentUser.roles.indexOf(role) > -1;
    } else {
      return false;
    }
  }

  // Checks if the current user is in one of these roles.
  public isInRoles(roles: string[]): boolean {
    let result = false;
    if (this.userAuth.currentUser && this.userAuth.currentUser.roles) {
      roles.forEach(role => {
        if (this.userAuth.currentUser.roles.indexOf(role) > -1) {
          result = true;
        }
      });
    }
    return result;
  }

  // Repository of Roles: Routes
  public addRouteRoles(route: string, roles: string[]) {
    this.routeRoles.set(route, roles);
  }

  public getRouteRoles(route: string): string[] {
    return this.routeRoles.get(route);
  }
}
