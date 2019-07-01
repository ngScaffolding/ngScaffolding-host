import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsQuery } from '../appSettings/appSettings.query';
import { UserAuthenticationQuery } from '../userAuthentication/userAuthentication.query';
import { LoggingService } from '../logging/logging.service';
import { RolesService } from '../rolesService/roles.service';
import { IUserModel, AppSettings } from 'ngscaffolding-models';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private className = 'core.UserService';

  private apiHome: string;

  constructor(
    private http: HttpClient,
    private appSettingsQuery: AppSettingsQuery,
    private authQuery: UserAuthenticationQuery,
    private log: LoggingService,
    public rolesService: RolesService
  ) {}

  public getUser(userId: string): Observable<IUserModel> {
    return new Observable<IUserModel>(observer => {
      this.http.get(`${this.appSettingsQuery.getEntity(AppSettings.apiAuth)}/api/v1/users/${userId}`);
    }).pipe(timeout(30000));
  }

  public saveUser(user: IUserModel): Observable<any> {
    return new Observable<IUserModel>(observer => {
      this.http.post(`${this.appSettingsQuery.getEntity(AppSettings.apiAuth)}/api/v1/users/`, user);
    }).pipe(timeout(30000));
  }
}
