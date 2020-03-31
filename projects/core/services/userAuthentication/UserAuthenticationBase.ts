import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BasicUser } from 'ngscaffolding-models';

@Injectable()
export abstract class UserAuthenticationBase {

  abstract getToken(): string;
  abstract forceLogon();
  abstract logon(userName: string, password: string);
  abstract logoff();

  abstract async completeAuthentication();
  abstract isAuthenticated(): boolean;
  abstract authorizationHeaderValue();
  abstract name(): string;
}
