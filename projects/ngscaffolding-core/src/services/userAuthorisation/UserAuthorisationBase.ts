import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthUser } from '@ngscaffolding/models';

@Injectable()
export abstract class UserAuthorisationBase {
  authenticated$ = new Observable<boolean>(null);
  currentUser: AuthUser;
  isAuthenticated(): boolean { return null; }
  abstract getToken(): string;
  abstract logon(userName: string, password: string): Observable<AuthUser>;
  abstract logoff();
}
