import { Component, OnInit } from '@angular/core';
import {
  LoggingService,
  AppSettingsService,
  NotificationService,
  SpinnerService,
  UserAuthorisationBase
} from 'ngscaffolding-core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
// import {MessageService} from 'primeng/components/common/messageservice';

@Component({
  templateUrl: 'loginPage.component.html'
})
export class LoginPageComponent implements OnInit {
  private readonly className = 'LoginPagecomponent';
  private readonly rememberMeCookie = 'authRememberMe';
  private readonly userNameCookie = 'authuserName';

  inputModel: any = {};

  rememberMe: boolean;

  returnUrl: string;

  constructor(
    //   private messageService: MessageService,
    private cookieService: CookieService,
    public appSettings: AppSettingsService,
    private spinner: SpinnerService,
    private logger: LoggingService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService: SpinnerService,
    private userAuthService: UserAuthorisationBase
  ) {}

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Are we going to Remember?
    if (this.appSettings.authShowRememberMe) {
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

    this.userAuthService.logon(this.inputModel.username,this.inputModel.password)
    .subscribe(authUser => {
      this.router.navigate([this.returnUrl]);
    }, err =>{
      this.notificationService.showMessage({
        summary: 'Logon Failed',
        detail: 'Check you User Name and Password and try again',
        severity: 'error'
      });
      this.spinnerService.hideSpinner();
    });
  }

  rememberChanged(isChecked: boolean) {
    this.logger.info(`Remember Me (${isChecked})`, this.className);
    this.cookieService.set(this.rememberMeCookie, isChecked.toString());
  }
}
