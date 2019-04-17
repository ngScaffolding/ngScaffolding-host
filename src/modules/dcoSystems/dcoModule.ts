import { NgModule, ModuleWithProviders } from '@angular/core';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes, Router, Route } from '@angular/router';

import { AppSettings } from '@ngscaffolding/models';

import {
  AppSettingsService,
  CoreModule,
  MenuService,
  LoggingService,
  VersionsService, DynamicComponentService, AuthoriseRoleGuard
} from 'ngscaffolding-core';

import { InputBuilderModule } from 'ngscaffolding-inputbuilder';

import { DatagridModule, DataGridComponent } from 'ngscaffolding-datagrid';
import { ChartingModule, ChartComponent } from 'ngscaffolding-chart';
import { TopDashboardComponent } from './pages/topDashboard/topDashboard.component';
import { DigitalReadoutComponent } from './components/digitalReadout/digitalReadout.component';

import { ButtonModule, CardModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { SharedModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { EditorModule } from 'primeng/primeng';
import { FieldsetModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { MultiSelectModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { ProgressSpinnerModule } from 'primeng/primeng';
import { SpinnerModule } from 'primeng/primeng';
import { TabMenuModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { DynamicModule } from 'ng-dynamic-component';

const dashboardRoute: Route =  { path: 'dcodashboard', component: TopDashboardComponent, canActivate: [AuthoriseRoleGuard] };

const appRoutes: Routes = [
  dashboardRoute
];

@NgModule({
  imports: [
    CoreModule.forRoot(),
    CommonModule,
    InputBuilderModule,
    DatagridModule,
    ChartingModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    SharedModule,
    DialogModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    InputTextModule,
    MultiSelectModule,
    PanelModule,
    ProgressSpinnerModule,
    SpinnerModule,
    TabMenuModule,
    TabViewModule,
    DynamicModule.withComponents([DataGridComponent, ChartComponent, DigitalReadoutComponent]),
    RouterModule.forChild(appRoutes)
  ],
  declarations: [
    TopDashboardComponent,
    DigitalReadoutComponent
  ],
  exports: [
    TopDashboardComponent,
    RouterModule]
})
export class DCOAppModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DCOAppModule
    };
  }

  constructor(
    appSettingsService: AppSettingsService,
    dynamicComponentService: DynamicComponentService,
    menuService: MenuService,
    logger: LoggingService,
    versions: VersionsService,
    router: Router
  ) {
    logger.info('Setting Values', 'DCO.startup');

    versions.addVersion('DCO', VERSION.version, true);

    appSettingsService.setValue(AppSettings.title, 'DCO Systems');
    appSettingsService.setValue(AppSettings.iconUrl, 'data:image/png;base64,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');
    // AppSettings.apiAuth = 'https://dcoauthapi.azurewebsites.net';
    // AppSettings.apiHome = 'https://dcowebapi.azurewebsites.net';

    appSettingsService.setValue(AppSettings.apiHome, 'http://localhost:3000');
    appSettingsService.setValue(AppSettings.apiAuth, 'http://localhost:3010');
    appSettingsService.setValue(AppSettings.errorLogConsole, true);
    appSettingsService.setValue(AppSettings.errorLogServer, true);
    appSettingsService.setValue(AppSettings.errorShowUser, true);

    appSettingsService.setValue(AppSettings.inputShowCalendarIcon, true);

    appSettingsService.setValue(AppSettings.showFullMessages, false);
    appSettingsService.setValue(AppSettings.showToastMessages, true);

    appSettingsService.setValue(AppSettings.showProfileSetting, true);
    appSettingsService.setValue(AppSettings.showUserSetting, true);
    appSettingsService.setValue(AppSettings.showProfilePicture, false);
    appSettingsService.setValue(AppSettings.inputDateFormat, 'dd/mm/yy');

    appSettingsService.setValue(AppSettings.authClientId, 'democlient');
    appSettingsService.setValue(AppSettings.authClientSecret, 'democlientsecret');
    appSettingsService.setValue(AppSettings.authScope, 'offline_access openid');
    appSettingsService.setValue(AppSettings.authShowForgotPassword, true);
    appSettingsService.setValue(AppSettings.authShowRegister, true);
    appSettingsService.setValue(AppSettings.authShowRememberMe, true);
    appSettingsService.setValue(AppSettings.authSaveinLocalStorage, true);
    appSettingsService.setValue(AppSettings.authTokenEndpoint, '/auth/token');
    appSettingsService.setValue(AppSettings.authTermsAndConditions,
      'DCO Systems Terms and Conditions Here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.');

    appSettingsService.registerDynamicTypes([DigitalReadoutComponent]);

    // Register dynamic components here
    // dynamicComponentService.registerComponent(machineDetailsRoute);

  }
}
