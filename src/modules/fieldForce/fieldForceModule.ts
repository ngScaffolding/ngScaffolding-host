import { NgModule, ModuleWithProviders } from '@angular/core';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes, Router, Route } from '@angular/router';

import { AppSettings } from '@ngscaffolding/models';



import {
  AppSettingsService,
  MenuService,
  LoggingService,
  VersionsService,
  DynamicComponentService
} from 'ngscaffolding-core';

import { InputBuilderModule } from 'ngscaffolding-inputbuilder';

import { DatagridModule } from '../datagrid/datagridModule';
import { MachineDetailsComponent } from './pages/Finder/MachineDetails/machineDetails.component';
import { DetailsListComponent } from './components/detailsList/detailsList.component';
import { UpgradeCalcComponent } from './components/upgradeCalc/upgradeCalc.component';

import { ButtonModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { CardModule } from 'primeng/primeng';
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
import { ScrollPanelModule } from 'primeng/primeng';

// export * from './pages';

const machineDetailsRoute: Route =  { path: 'fieldforcemachinedetails', component: MachineDetailsComponent, outlet: 'popup' };
const upgradeCalcRoute: Route =  { path: 'fieldforceupgradeCalc', component: UpgradeCalcComponent };

const appRoutes: Routes = [
  machineDetailsRoute,
  upgradeCalcRoute
];

@NgModule({
  imports: [
    CommonModule,
    InputBuilderModule,
    DatagridModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    SharedModule,
    DialogModule,
    PanelModule,
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
    ScrollPanelModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [
    MachineDetailsComponent,
    DetailsListComponent,
    UpgradeCalcComponent
  ],
  exports: [
    // MachineDetailsComponent,
    RouterModule]
})
export class FieldForceAppModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FieldForceAppModule
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
    logger.info('Setting Values', 'FieldForce.startup');

    versions.addVersion('FieldForce', VERSION.version, true);

    const settings: AppSettings = new AppSettings();
    settings.title = 'FieldForce Application';
    settings.iconUrl = 'data:image/png;base64,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';
    // settings.apiHome = 'http://essoft-vm.cloudapp.net:3000';
    // settings.apiAuth = 'http://essoft-vm.cloudapp.net:3010';
    settings.apiHome = 'http://localhost:3000';
    settings.apiAuth = 'http://localhost:3010';
    settings.errorLogConsole = true;
    settings.errorLogServer = true;
    settings.errorShowUser = true;

    settings.inputShowCalendarIcon = true;

    settings.showFullMessages = false;
    settings.showToastMessages = true;

    settings.showProfileSetting = false;
    settings.showUserSetting = false;
    settings.showProfilePicture = false;

    settings.authClientId = 'democlient';
    settings.authClientSecret = 'democlientsecret';
    settings.authScope = 'offline_access openid';
    settings.authShowForgotPassword = true;
    settings.authShowRegister = true;
    settings.authShowRememberMe = true;
    settings.authSaveinLocalStorage = true;
    settings.authTokenEndpoint = '/auth/token';
    settings.authTermsAndConditions =
      'FieldForce Terms and Conditions Here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

    appSettingsService.setValues(settings);

    dynamicComponentService.registerComponent(machineDetailsRoute);

    menuService.addMenuItems([]);
  }
}
