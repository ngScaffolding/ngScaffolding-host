import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BasicUser } from 'ngscaffolding-models';

@Injectable()
export abstract class UserAuthenticationBase {

  abstract getToken(): string;
  abstract logon(userName: string, password: string): Observable<BasicUser>;
  abstract logoff();
}
