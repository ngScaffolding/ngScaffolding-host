import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { AuthUser } from '../../models';

@Injectable()
export abstract class UserAuthorisationBase {
  authenticatedSubject = new BehaviorSubject<boolean>(null);
  currentUser: AuthUser;
  isAuthenticated(): boolean { return null; }
  setToken(token: any) { }
  getToken(): string { return null; }
  logon(userName: string, password: string) { }
  logoff() { }
}
