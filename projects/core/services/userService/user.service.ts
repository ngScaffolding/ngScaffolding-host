import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserAuthenticationQuery } from '../userAuthentication/userAuthentication.query';
import { LoggingService } from '../logging/logging.service';
import { RolesService } from '../rolesService/roles.service';
import { IUserModel, AppSettings, ChangePasswordModel } from 'ngscaffolding-models';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { UserServiceBase } from './user.service.base';
import { AppSettingsService } from '../appSettings/appSettings.service';


@Injectable({
  providedIn: 'root',
})
export class UserService implements UserServiceBase  {
  private className = 'core.UserService';

  private apiHome: string;

  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService,
    private authQuery: UserAuthenticationQuery,
    private log: LoggingService,
    public rolesService: RolesService
  ) {}

  getUsers() {
    return new Observable<IUserModel[]>(observer => {
      this.http.get(`${this.appSettingsService.getValue(AppSettings.apiAuth)}/api/v1/users`);
    }).pipe(timeout(30000));
  }
  createUser(user: any) {
    return new Observable<IUserModel>(observer => {
      this.http.post(`${this.appSettingsService.getValue(AppSettings.apiAuth)}/api/v1/users`, user);
    }).pipe(timeout(30000));
  }
  deleteUser(userId: any) {
    return new Observable<null>(observer => {
      this.http.delete(`${this.appSettingsService.getValue(AppSettings.apiAuth)}/api/v1/users/${userId}`);
    }).pipe(timeout(30000));
  }
  changePassword(changePasswordModel: ChangePasswordModel) {
    return new Observable<null>(observer => {
      this.http.post(`${this.appSettingsService.getValue(AppSettings.apiAuth)}/api/v1/users/changePassword`, changePasswordModel)
        .pipe(timeout(30000))
        .subscribe(response => {
          observer.next(null);
          observer.complete();
        },
        err => {
          observer.error(err);
        });
    });
  }
  resetPassword(userId: any) {
    return new Observable<null>(observer => {
      this.http.get(`${this.appSettingsService.getValue(AppSettings.apiAuth)}/api/v1/users/resetPassword/${userId}`);
    }).pipe(timeout(30000));
  }


  public getUser(userId: string): Observable<IUserModel> {
    return new Observable<IUserModel>(observer => {
      this.http.get(`${this.appSettingsService.getValue(AppSettings.apiAuth)}/api/v1/users/${userId}`);
    }).pipe(timeout(30000));
  }

  public saveUser(user: IUserModel): Observable<any> {
    return new Observable<IUserModel>(observer => {
      this.http.post(`${this.appSettingsService.getValue(AppSettings.apiAuth)}/api/v1/users/`, user);
    }).pipe(timeout(30000));
  }
}
