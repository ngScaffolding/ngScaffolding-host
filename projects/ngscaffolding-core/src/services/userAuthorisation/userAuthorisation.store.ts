import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { createBasicUser , BasicUser } from '@ngscaffolding/models';


export interface AuthorisationState {
  token: string;
  userDetails: BasicUser;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'authorisation' })
export class AuthorisationStore extends EntityStore<AuthorisationState, AuthorisationValue> {

  constructor() {
    super(createBasicUser());
    console.log('AuthorisationStore Constructor');
  }
}

