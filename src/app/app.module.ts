import {NgModule, APP_INITIALIZER } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutes} from './app.routes';
import { Router, RouteConfigLoadEnd, NavigationStart } from '@angular/router';
import { addDynamicDatagridComponents } from '../classes/dynamicDatagrid';
import { TranslateModule } from '@ngx-translate/core';

import {AppComponent} from './app.component';
import {AppMenuComponent, AppSubMenuComponent} from './app.menu.component';
// import {AppTopbarComponent} from './app.topbar.component';
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
import { AppTopBarComponent } from './components/appTopbar/app.topbar.component';

import { PRIME_COMPONENTS } from './app.prime.components';
import { ConfirmationService } from 'primeng/primeng';
import { APP_COMPONENTS } from './app.component.list';
import { MessageService } from 'primeng/components/common/messageservice';

import {
  CoreModule, AuthoriseRoleGuard, AppSettingsService, UserAuthenticationBase, UserAuthenticationService,
  UserAuthenticationQuery,
  CoreErrorHandlerService, VersionsService, DynamicComponentService } from 'ngscaffolding-core';

  // Externalise These Modules
  import { DatagridModule } from 'ngscaffolding-datagrid';
  import { InputBuilderModule } from 'ngscaffolding-inputbuilder';
  import { DashboardModule } from 'ngscaffolding-dashboard';
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
import { ProfilePageComponent } from './pages/profile/profilePage.component';

// Services
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';
import { AppSettings } from '@ngscaffolding/models';

export function jwtOptionsFactory(authQuery: UserAuthenticationQuery) {
  return {
    tokenGetter: () => {
      return authQuery.getSnapshot().token;
    }
  };
}

const appInitializerFn = (appConfig: AppSettingsService) => {
  return () => {
    return null; // appConfig.loadFromJSON();
  };
};

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
        CoreModule.forRoot(),
        DatagridModule,
        InputBuilderModule,
        DashboardModule,
        TranslateModule.forRoot(),

        JwtModule.forRoot({
          jwtOptionsProvider: {
          provide: JWT_OPTIONS,
          useFactory: jwtOptionsFactory,
          deps: [UserAuthenticationQuery]
        }}),

        environment.production ? [] : AkitaNgDevtools.forRoot({ logTrace: false })
    ],
    declarations: [
        AppComponent,
        AppMenuComponent,
        AppSubMenuComponent,
        // AppTopbarComponent,
        AppTopBarComponent,
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
        ProfilePageComponent,
        APP_COMPONENTS,
        RegisterComponent,
        ForgotPasswordComponent,
        UserSettingsComponent
    ],
    providers: [
        BreadcrumbService,
        // ngScaffolding
        Title,
        CookieService,
        ConfirmationService,
        // ngScaffolding-core
        { provide: ErrorHandler, useClass: CoreErrorHandlerService },
        // HTTP Token Interceptor
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
        {
          provide: APP_INITIALIZER,
          useFactory: appInitializerFn,
          multi: true,
          deps: [AppSettingsService]
        },
        AuthoriseRoleGuard,
        { provide: UserAuthenticationBase, useClass: UserAuthenticationService},
        MessageService,
        // ngScaffolding
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private versions: VersionsService, private router: Router, private dynamicComponents: DynamicComponentService) {
  versions.addVersion('@ngscaffolding/host', VERSION.version);

  this.router.events.subscribe(async routerEvent => {

    if (routerEvent instanceof NavigationStart) {
      const event = routerEvent as NavigationStart;
      if (event.url.startsWith('/datagrid')) {
        addDynamicDatagridComponents(this.router.config, this.dynamicComponents);
      }
    }
  });
}
}
