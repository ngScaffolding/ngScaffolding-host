import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { AuthorisationStore, AuthorisationState } from './userAuthorisation.store';
import { AuthorisationValue } from '@ngscaffolding/models';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthorisationQuery extends QueryEntity<AuthorisationState, AuthorisationValue> {

  isInitialised$ = this.select(state => state.isInitialised);

  constructor(protected store: AuthorisationStore) {
    super(store);
  }


}
