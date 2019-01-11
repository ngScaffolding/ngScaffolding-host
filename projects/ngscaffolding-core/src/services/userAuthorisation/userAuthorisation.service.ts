import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { AppSettingsService } from '../appSettings/appSettings.service';
import { LoggingService } from '../logging/logging.service';

import { AuthUser, AuthUserResponse, AppSettings } from '@ngscaffolding/models';

import { JwtHelperService } from '@auth0/angular-jwt';
import { UserAuthorisationBase } from './UserAuthorisationBase';
import { AppSettingsQuery } from '../appSettings';

@Injectable({ providedIn: 'root' })
export class UserAuthorisationService implements UserAuthorisationBase {
  private readonly tokenStorageKey = 'USER_TOKEN';

  public authenticated$: Observable<boolean>;
  private authenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private refreshToken: string;
  private jwtHelper: JwtHelperService;

  currentUser: AuthUser;

  constructor(
    private logger: LoggingService,
    private http: HttpClient,
    private appSettingsService: AppSettingsService,
    private appSettingsQuery: AppSettingsQuery
  ) {
    logger.info('UserAuthorisationService - Constructor');
    this.authenticated$ = this.authenticatedSubject.asObservable();

    this.jwtHelper = new JwtHelperService({});

    this.loadUserTokenFromStorage();
  }

  private loadUserTokenFromStorage() {
    const savedToken = localStorage.getItem(this.tokenStorageKey); // Loaded from Saved Storage
    if (savedToken !== null) {
      // New AuthUser Based on Token
      if (!this.jwtHelper.isTokenExpired(savedToken)) {
        this.logger.info('Token Loaded and not Expired');
        // If all Good
        this.setToken(savedToken);
        this.getUserDetails();
      } else {
        this.logger.info('Token Expired - Logging Off');
        this.logoff();
      }
    } else {
      this.logger.info('No Token Available - Logging Off');
      this.logoff();
    }
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !this.jwtHelper.isTokenExpired(token);
  }

  public setToken(token: any) {
    // New AuthUser Based on Token
    const tokenDetails = this.jwtHelper.decodeToken(token);

    this.currentUser = new AuthUser();
    this.currentUser.tokenExpires = this.jwtHelper.getTokenExpirationDate(token);
    if (this.jwtHelper.isTokenExpired(token)) {
      this.tokenExpired();
    }

    if (this.appSettingsService.getValue(AppSettings.authSaveinLocalStorage)) {
      // Save token to local storage
      localStorage.setItem(this.tokenStorageKey, token);
    }

    if (tokenDetails['firstName'] && tokenDetails['lastName']) {
      this.currentUser.name = tokenDetails['firstName'] + ' ' + tokenDetails['lastName'];
    }

    if (tokenDetails['roles']) {
      this.currentUser.roles = tokenDetails['roles'];
    }

    this.appSettingsService.setValue(AppSettings.authToken, token);
    this.authenticatedSubject.next(this.isAuthenticated());

    // this.spinnerService.hideSpinner();
  }

  public getToken(): string {
    return this.appSettingsService.getValue(AppSettings.authToken);
  }

  private getUserDetails() {
    this.http
      .get<AuthUserResponse>(this.appSettingsService.getValue(AppSettings.apiAuth) + '/connect/userinfo', {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.appSettingsService.getValue(AppSettings.authToken))
      })
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

  public logon(userName: string, password: string): Observable<AuthUser> {
    return new Observable<AuthUser>(observer => {
      let body = new HttpParams();
      body = body
        .append('username', userName)
        .append('password', password)
        .append('grant_type', 'password')
        .append('client_id', this.appSettingsService.getValue(AppSettings.authClientId))
        .append('client_secret', this.appSettingsService.getValue(AppSettings.authClientSecret))
        .append('scope', this.appSettingsService.getValue(AppSettings.authScope) + ' offline_access openid');

      this.http
        .post(this.appSettingsService.getValue(AppSettings.apiAuth) + this.appSettingsService.getValue(AppSettings.authTokenEndpoint), body, {
          headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        })
        .subscribe(
          response => {
            this.setToken(response['access_token']);
            if (response['refresh_token']) {
              this.refreshToken = response['refresh_token'];
            }

            // Get Additional Details
            // this.getUserDetails();
            observer.next(null);
            observer.complete();
          },
          err => {
            observer.error(err);
          }
        );
    });
  }

  public logoff(): void {
    if (this.appSettingsService.getValue(AppSettings.authSaveinLocalStorage)) {
      // Remove token from Local Storage
      localStorage.removeItem(this.tokenStorageKey);
    }
    this.appSettingsService.setValue(AppSettings.authToken, null);

    // Tell the world
    this.authenticatedSubject.next(false);
  }

  private tokenExpired() {}
}
