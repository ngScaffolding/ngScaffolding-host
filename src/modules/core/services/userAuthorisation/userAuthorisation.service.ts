import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { BroadcastService } from '../broadcast/broadcast.service';
import { AppSettingsService } from '../appSettings/appSettings.service';
import { LoggingService } from '../logging/logging.service';

import { AuthUser } from '../../models/authUser.model';
import { AuthUserResponse } from '../../models/authUserResponse.model';
import { NotificationService } from '../notification/notification.service';

import { JwtHelperService } from '@auth0/angular-jwt';
import { SpinnerService } from '../spinnerService/spinner.service';
import { UserAuthorisationBase } from './UserAuthorisationBase';

@Injectable()
export class UserAuthorisationService implements UserAuthorisationBase {
  private readonly tokenStorageKey = 'USER_TOKEN';

  public authenticatedSubject: BehaviorSubject<boolean>;

  private refreshToken: string;

  currentUser: AuthUser;

  constructor(
    private logger: LoggingService,
    private spinnerService: SpinnerService,
    private http: HttpClient,
    private appSettingsService: AppSettingsService,
    private notificationService: NotificationService,
    private broadcastService: BroadcastService,
    private jwtHelper: JwtHelperService
  ) {
    this.authenticatedSubject = new BehaviorSubject<boolean>(null);

    appSettingsService.settingsSubject.subscribe(settings => {
      if (settings && settings.authSaveinLocalStorage) {
        const savedToken = localStorage.getItem(this.tokenStorageKey); // Loaded from Saved Storage
        if (savedToken !== null) {
          // New AuthUser Based on Token
          if (!this.jwtHelper.isTokenExpired(savedToken)) {
            // If all Good
            this.setToken(savedToken);
            this.getUserDetails();
          } else {
            this.logoff();
          }
        } else {
          this.logoff();
        }
      }
    });
  }

  public isAuthenticated(): boolean {
    const token =  this.getToken();
    return !this.jwtHelper.isTokenExpired(token);
  }

  public setToken(token: any) {
    // New AuthUser Based on Token
    const tokenDetails = this.jwtHelper.decodeToken(token);

    this.currentUser = new AuthUser();
    this.currentUser.tokenExpires = this.jwtHelper.getTokenExpirationDate(token);
    if (this.currentUser.tokenExpires < new Date()) {
      this.tokenExpired();
    }

    if (this.appSettingsService.authSaveinLocalStorage) {
      // Save token to local storage
      localStorage.setItem(this.tokenStorageKey, token);
    }

    const roles = tokenDetails['role'] as Array<string>;
    if (roles) {
      roles.forEach(role => this.currentUser.roles.push(role));
    }

    this.appSettingsService.authToken = token;
    this.authenticatedSubject.next(this.isAuthenticated());

    this.spinnerService.hideSpinner();
  }

  public getToken(): string {
    return this.appSettingsService.authToken;
  }

  private getUserDetails() {
    this.http
      .get<AuthUserResponse>(
        this.appSettingsService.apiAuth + '/connect/userinfo',
        {
          headers: new HttpHeaders().set(
            'Authorization',
            'Bearer ' + this.appSettingsService.authToken
          )
        }
      )
      .subscribe(
        authResponse => {
          this.currentUser.email = authResponse.email;
          this.currentUser.name = authResponse.name;
          this.currentUser.roles = authResponse.role;
          this.currentUser.userId = authResponse.sub;
        },
        err => {
          if (err.status === 401) {
            this.logoff();
          }
        }
      );
  }

  public logon(userName: string, password: string) {
    let body = new HttpParams();
    body = body
      .append('username', userName)
      .append('password', password)
      .append('grant_type', 'password')
      .append('client_id', this.appSettingsService.authClientId)
      .append('client_secret', this.appSettingsService.authClientSecret)
      .append(
        'scope',
        this.appSettingsService.authScope + ' offline_access openid'
      );

    this.http
      .post(this.appSettingsService.apiAuth + '/connect/token', body, {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        )
      })
      .subscribe(
        response => {
          this.setToken(response['access_token']);
          if (response['refresh_token']) {
            this.refreshToken = response['refresh_token'];
          }

          // Get Additional Details
          this.getUserDetails();
        },
        err => {
          this.notificationService.showMessage({
            summary: 'Logon Failed',
            detail: 'Check you User Name and Password and try again',
            severity: 'error'
          });
          this.spinnerService.hideSpinner();
        }
      );
  }

  public logoff(): void {
    if (this.appSettingsService.authSaveinLocalStorage) {
      // Remove token from Local Storage
      localStorage.removeItem(this.tokenStorageKey);
    }
    this.appSettingsService.authToken = null;

    // Tell the world
    this.authenticatedSubject.next(this.isAuthenticated());
  }

  private tokenExpired() {}
}
