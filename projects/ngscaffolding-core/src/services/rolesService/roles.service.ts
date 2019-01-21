import { Injectable } from '@angular/core';
import { UserAuthenticationQuery } from '../userAuthentication';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private routeRoles = new Map<string, string[]>();

  constructor(public authQuery: UserAuthenticationQuery) {}

  // Checks if the current user is in this role.
  public isInRole(role: string): boolean {
    const currentUser = this.authQuery.getSnapshot().userDetails;
    if (currentUser && currentUser.roles) {
      return currentUser.roles.indexOf(role) > -1;
    } else {
      return false;
    }
  }

  // Checks if the current user is in one of these roles.
  public isInRoles(roles: string[]): boolean {
    let result = false;
    const currentUser = this.authQuery.getSnapshot().userDetails;
    if (currentUser && currentUser.roles) {
      roles.forEach(role => {
        if (currentUser.roles.indexOf(role) > -1) {
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
