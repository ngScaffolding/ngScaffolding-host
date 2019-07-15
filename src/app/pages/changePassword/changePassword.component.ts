import { Component, ElementRef, OnInit } from '@angular/core';
import { SpinnerService, ComponentLoaderService, UserServiceBase, UserAuthenticationQuery, AppSettingsQuery, LoggingService, NotificationService, UserAuthenticationService } from 'ngscaffolding-core';
import { ChangePasswordModel, AppSettings } from 'ngscaffolding-models';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'changePassword.component.html',
  styleUrls: ['changePassword.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  inputModel: any = {};
  minLength: number;
  upperCase: boolean;
  lowerCase: boolean;
  numerics: boolean;
  specialChars: boolean;

  complexityPassed = false;
  failComplexLength = false;
  failComplexUpperCase = false;
  failComplexLowerCase = false;
  failComplexNumerics = false;
  failComplexSpecial = false;

  constructor(private userService: UserServiceBase,
    private notificationService: NotificationService,
    private userAuthService: UserAuthenticationService,
    private router: Router,
    private logger: LoggingService, private authQuery: UserAuthenticationQuery,
    private appSettings: AppSettingsQuery, private spinner: SpinnerService, private componentLoader: ComponentLoaderService, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.minLength = this.appSettings.getEntity(AppSettings.authPasswordMinLength).value;
    this.upperCase = this.appSettings.getEntity(AppSettings.authPasswordUpperCase).value;
    this.lowerCase = this.appSettings.getEntity(AppSettings.authPasswordLowerCase).value;
    this.numerics = this.appSettings.getEntity(AppSettings.authPasswordNumeric).value;
    this.specialChars = this.appSettings.getEntity(AppSettings.authPasswordSpecial).value;
  }

  checkComplexity(event: any) {
    const newPassword = this.inputModel.newPassword;
    if (newPassword.length < this.minLength) {
      this.failComplexLength = true;
    } else {
      this.failComplexLength = false;
    }

    if (this.upperCase) {
      this.failComplexUpperCase = ! /[A-Z]/.test(newPassword);
    } else {
      this.failComplexUpperCase = false;
    }

    if (this.lowerCase) {
      this.failComplexLowerCase = ! /[a-z]/.test(newPassword);
    } else {
      this.failComplexLowerCase = false;
    }

    if (this.numerics) {
      this.failComplexNumerics = ! /\d/.test(newPassword);
    } else {
      this.failComplexNumerics = false;
    }

    if (this.specialChars) {
      this.failComplexSpecial = ! /[!@#\$%\^&]/.test(newPassword);
    } else {
      this.failComplexSpecial = false;
    }
    this.complexityPassed = !(this.failComplexLength ||
      this.failComplexLowerCase ||
      this.failComplexUpperCase ||
      this.failComplexNumerics ||
      this.failComplexSpecial);
  }
  changePassword() {
    this.spinner.showSpinner('Changing Password');

    const change: ChangePasswordModel = {
      userId: this.authQuery.getSnapshot().userDetails.userId,
      currentPassword: this.inputModel.currentPassword,
      newPassword: this.inputModel.newPassword
    };

    this.userService.changePassword(change)
      .subscribe(result => {
      this.notificationService.showMessage({
        severity: 'success',
        summary: 'Success',
        detail: 'Password Changed. You will now be logged off.',
        life: 3000
      });
      this.userAuthService.logoff();
        this.spinner.hideSpinner();
        setTimeout(_ => {
          this.router.navigateByUrl('/login');
        }, 4000);
      }, err => {
        this.notificationService.showMessage({
          severity: 'error',
          summary: 'Change Password Failed',
          detail: err.error.message,
          life: 4000
        });
          this.spinner.hideSpinner();
      });
    }
}
