import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { AppRoutes } from './app.routes';
import 'rxjs/add/operator/toPromise';
import { CookieService } from 'ngx-cookie-service';

import { PRIME_COMPONENTS } from './app.prime.components';
import { MessageService } from 'primeng/components/common/messageservice';

import {AgGridModule} from 'ag-grid-angular/main';

import {
  AppSettingsService,
  UserAuthorisationService,
  BroadcastService,
  CacheService,
  CoreErrorHandlerService,
  LoggingService,
  NotificationService,
  MenuService,
  ReferenceValuesService,
  SpinnerService,
  RolesService,
  UserPreferencesService
} from '@ngscaffolding/core';

import { CUSTOM_IMPORTS } from '../../custom/custom.app';

import { APP_COMPONENTS } from './app.component.list';
import { AppComponent } from './app.component';
import { AppMenuComponent, AppSubMenu } from './app.menu.component';
import { AppTopBarComponent } from './components/appTopbar/app.topbar.component';
import { AppFooter } from './app.footer.component';
import { InlineProfileComponent } from './app.profile.component';

// Pages
import { LandingPageComponent } from './components/landingPage/landingPage.component';
import { PageNotFoundComponent } from './pages/pageNotFound/pageNotFound.component';
import { LoginPageComponent } from './pages/login/loginPage.component';
import { LogoffPageComponent } from './pages/logoff/logoffPage.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

// Services
import { NotificationReceiverService } from './services/notificationReceiver/notificationReceiver.service';
import { TokenInterceptor } from './interceptors/token.interceptor';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutes,
    HttpClientModule,
    BrowserAnimationsModule,
    PRIME_COMPONENTS,
    CUSTOM_IMPORTS,
    AgGridModule.withComponents([])
  ],

  declarations: [
    AppComponent,
    AppMenuComponent,
    AppSubMenu,
    AppTopBarComponent,
    AppFooter,
    InlineProfileComponent,

    // Pages
    LandingPageComponent,
    LoginPageComponent,
    LogoffPageComponent,
    PageNotFoundComponent,
    APP_COMPONENTS,
    RegisterComponent,
    ForgotPasswordComponent
  ],
  providers: [
    Title,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    CookieService,
    // ngScaffolding-core
    { provide: ErrorHandler, useClass: CoreErrorHandlerService },
    // HTTP Token Interceptor
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    AppSettingsService,
    UserAuthorisationService,
    BroadcastService,
    CacheService,
    LoggingService,
    NotificationService,
    NotificationReceiverService,
    MenuService,
    MessageService,
    ReferenceValuesService,
    RolesService,
    SpinnerService,
    UserPreferencesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
