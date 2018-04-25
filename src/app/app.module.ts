import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {AppRoutes} from './app.routes';
import 'rxjs/add/operator/toPromise';

import {AppComponent} from './app.component';
import {AppMenuComponent, AppSubMenuComponent} from './app.menu.component';
import {AppTopbarComponent} from './app.topbar.component';
import {AppFooterComponent} from './app.footer.component';
import {AppBreadcrumbComponent } from './app.breadcrumb.component';
import {AppRightpanelComponent} from './app.rightpanel.component';
import {AppInlineProfileComponent} from './app.profile.component';

import {BreadcrumbService} from './breadcrumb.service';

// ngScaffolding Imports
import { ErrorHandler } from '@angular/core';
import { VERSION } from '../version';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

import { PRIME_COMPONENTS } from './app.prime.components';
import { APP_COMPONENTS } from './app.component.list';
import { MessageService } from 'primeng/components/common/messageservice';
import { ActionService, AppSettingsService,  UserAuthorisationService,  BroadcastService,  CacheService,
  CoreErrorHandlerService,  LoggingService,  NotificationService,  MenuService,
  DataSourceService , ReferenceValuesService,
  SpinnerService,  RolesService,  UserPreferencesService,  VersionsService, CoreModule} from '../modules/core/coreModule';

  // Externalise These Modules
  import { DatagridModule } from '../modules/datagrid/datagridModule';
  import { InputBuilderModule } from '../modules/inputbuilder/inputbuilderModule';
  import { CUSTOM_IMPORTS } from '../../custom/custom.app';

// Pages
import { NgScaffoldingComponent } from './app.ngscaffolding.component';
import { LandingPageComponent } from './components/landingPage/landingPage.component';
import { PageNotFoundComponent } from './pages/pageNotFound/pageNotFound.component';
import { LoginPageComponent } from './pages/login/loginPage.component';
import { LogoffPageComponent } from './pages/logoff/logoffPage.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { AboutComponent } from './pages/about/about.component';
import { UserSettingsComponent } from './pages/userSettings/userSettings.component';

// Services
import { NotificationReceiverService } from './services/notificationReceiver/notificationReceiver.service';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { Button } from 'protractor';

export function jwtOptionsFactory(appSettings: AppSettingsService) {
  return {
    tokenGetter: () => {
      return appSettings.authToken;
    }
  };
}

// ngScaffolding Imports

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutes,
        HttpClientModule,
        BrowserAnimationsModule,
        PRIME_COMPONENTS,
        CUSTOM_IMPORTS,
        // To be External
        CoreModule,
        DatagridModule,
        InputBuilderModule,

        JwtModule.forRoot({
          jwtOptionsProvider: {
          provide: JWT_OPTIONS,
          useFactory: jwtOptionsFactory,
          deps: [AppSettingsService]
        }})
    ],
    declarations: [
        AppComponent,
        AppMenuComponent,
        AppSubMenuComponent,
        AppTopbarComponent,
        AppFooterComponent,
        AppBreadcrumbComponent,
        AppRightpanelComponent,
        AppInlineProfileComponent,

        // Pages
        NgScaffoldingComponent,
        AboutComponent,
        LandingPageComponent,
        LoginPageComponent,
        LogoffPageComponent,
        PageNotFoundComponent,
        APP_COMPONENTS,
        RegisterComponent,
        ForgotPasswordComponent,
        UserSettingsComponent
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        BreadcrumbService,
        // ngScaffolding
        Title,
        CookieService,
        // ngScaffolding-core
        { provide: ErrorHandler, useClass: CoreErrorHandlerService },
        // HTTP Token Interceptor
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
        ActionService,
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
        DataSourceService,
        RolesService,
        SpinnerService,
        UserPreferencesService, VersionsService
        // ngScaffolding
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private versions: VersionsService) {
  versions.addVersion('@ngscaffolding/host', VERSION.version);
}


}
