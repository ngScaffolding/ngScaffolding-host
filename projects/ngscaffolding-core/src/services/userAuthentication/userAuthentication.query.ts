import { Injectable } from '@angular/core';
import { Query, toBoolean } from '@datorama/akita';
import { AuthenticationStore, AuthenticationState } from './userAuthentication.store';
import { BasicUser } from '@ngscaffolding/models';
import { Observable } from 'rxjs/internal/Observable';
import { setStyles } from '@angular/animations/browser/src/util';

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationQuery extends Query<AuthenticationState> {

  authenticated$ = this.select(state => state.authenticated);
  currentUser$ = this.select(state => state.userDetails);

  constructor(protected store: AuthenticationStore) {
    super(store);
  }

  isAuthenticated() {
    return toBoolean(this.getSnapshot().authenticated);
  }
}
