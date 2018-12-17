import { UserAuthorisationBase } from 'ngscaffolding-core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { BroadcastService, AppSettingsService, LoggingService, NotificationService, SpinnerService } from 'ngscaffolding-core';

import { AuthUser } from '@ngscaffolding/models';

import { JwtHelperService } from '@auth0/angular-jwt';
import { KumulosDataService } from './kumulosData.service';

@Injectable()
export class KumulosAuthService implements UserAuthorisationBase {
  authenticated$: Observable<boolean>;
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
    private jwtHelper: JwtHelperService,
    // Kumulos bits
    private kumulos: KumulosDataService
  ) {
    this.authenticatedSubject = new BehaviorSubject<boolean>(null);

    appSettingsService.settingsValues$.subscribe(settings => {
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
    const token = this.getToken();
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
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.getToken());

    this.currentUser.roles = decodedToken['roles'];
    this.currentUser.userId = decodedToken['sub'];
  }

  public logon(userName: string, password: string): Observable<AuthUser> {
    return null;
    // this.kumulos.callFunction('loginUser', null, { email: userName, password: password }).subscribe(
    //   result => {
    //     this.setToken(result);

    //     this.currentUser.email = userName;

    //     // Get Additional Details
    //     this.getUserDetails();
    //   },
    //   err => {
    //     this.notificationService.showMessage({
    //       summary: 'Logon Failed',
    //       detail: 'Check you User Name and Password and try again',
    //       severity: 'error'
    //     });
    //     this.spinnerService.hideSpinner();
    //   }
    // );
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
