import { UserAuthorisationBase } from '../../core/coreModule';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { BroadcastService } from '../../core/services/broadcast/broadcast.service';
import { AppSettingsService } from '../../core/services/appSettings/appSettings.service';
import { LoggingService } from '../../core/services/logging/logging.service';

import { AuthUser } from '@ngscaffolding/models';
import { AuthUserResponse } from '../../core/models/authUserResponse.model';
import { NotificationService } from '../../core/services/notification/notification.service';

import { JwtHelperService } from '@auth0/angular-jwt';
import { SpinnerService } from '../../core/services/spinnerService/spinner.service';
import { KumulosDataService } from './kumulosData.service';

@Injectable()
export class KumulosAuthService implements UserAuthorisationBase {
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

  public logon(userName: string, password: string) {
    this.kumulos.callFunction('loginUser', null, { email: userName, password: password }).subscribe(
      result => {
        this.setToken(result);

        this.currentUser.email = userName;

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
