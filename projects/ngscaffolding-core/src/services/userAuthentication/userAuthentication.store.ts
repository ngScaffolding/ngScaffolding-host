import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { createBasicUser , BasicUser } from 'ngscaffolding-models';


export interface AuthenticationState {
  authenticated: boolean;
  token: string;
  refreshToken: string;
  userDetails: BasicUser;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'authorisation' })
export class AuthenticationStore extends Store<AuthenticationState> {

  constructor() {
    super(createBasicUser());
    console.log('AuthenticationStore Constructor');
  }
}

