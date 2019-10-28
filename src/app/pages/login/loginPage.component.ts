import { Component, OnInit } from '@angular/core';
import { LoggingService, AppSettingsService, AppSettingsQuery, NotificationService, SpinnerService, UserAuthenticationBase, UserAuthenticationQuery } from 'ngscaffolding-core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppSettings } from 'ngscaffolding-models';
import { Observable } from 'rxjs';

@Component({
  templateUrl: 'loginPage.component.html'
})
export class LoginPageComponent implements OnInit {
  private readonly rememberMeCookie = 'authRememberMe';
  private readonly userNameCookie = 'authuserName';

  public authShowRememberMe$: Observable<boolean>;
  public authTermsAndConditions$: Observable<string>;
  public authShowRegister$: Observable<boolean>;

  inputModel: any = {};

  rememberMe: boolean;

  returnUrl: string;

  constructor(
    //   private messageService: MessageService,
    private cookieService: CookieService,
    public appSettings: AppSettingsService,
    public appSettingsQuery: AppSettingsQuery,
    public authQuery: UserAuthenticationQuery,
    private spinner: SpinnerService,
    private logger: LoggingService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService: SpinnerService,
    private userAuthService: UserAuthenticationBase
  ) {
    this.authShowRememberMe$ = appSettingsQuery.selectEntity(AppSettings.authShowRememberMe, e => e.value);
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Check if already logged on
    if (this.authQuery.isAuthenticated) {
      // Send them packing
      if (this.returnUrl) {
        this.router.navigate([this.returnUrl]);
      } else {
        // Default route
        this.router.navigate(['']);
      }
    }

    // Are we going to Remember?
    if (this.appSettings.getValue(AppSettings.authShowRememberMe)) {
      const cookieValue = this.cookieService.get(this.rememberMeCookie);
      this.rememberMe = cookieValue === 'true';
      if (this.rememberMe) {
        this.inputModel.username = this.cookieService.get(this.userNameCookie);
      }
    }
  }

  login() {
    this.logger.info('Login Submit');

    this.spinner.showSpinner('Logging On');

    if (this.rememberMe && this.inputModel.username) {
      this.cookieService.set(this.userNameCookie, this.inputModel.username);
    } else {
      // Clear UserName
      this.cookieService.delete(this.userNameCookie);
    }

    this.userAuthService.logon(this.inputModel.username, this.inputModel.password).subscribe(
      authUser => {
        this.router.navigate([this.returnUrl]);
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

  rememberChanged(isChecked: boolean) {
    this.logger.info(`Remember Me (${isChecked})`);
    this.cookieService.set(this.rememberMeCookie, isChecked.toString());
  }
}
