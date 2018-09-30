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
  AuthoriseRoleGuard
} from '../core/coreModule';

import { InputBuilderModule } from '../inputbuilder/inputbuilderModule';

import { DatagridModule } from '../datagrid/datagridModule';
import { DynamicComponentService } from '../core/services/dynamicComponent/dynamicComponent.service';
import { MachineDetailsComponent } from './pages/Finder/MachineDetails/machineDetails.component';

// export * from './pages';

const machineDetailsRoute: Route =  { path: 'fieldforcemachinedetails', component: MachineDetailsComponent, outlet: 'popup' };

const appRoutes: Routes = [
  machineDetailsRoute
  // { path: 'inputbuildersimpletest', component: InputBuilderSimpleComponent, canActivate: [AuthoriseRoleGuard]  }
];

@NgModule({
  imports: [
    CommonModule,
    InputBuilderModule,
    DatagridModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [
    MachineDetailsComponent
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
    settings.iconUrl = '/assets/layout/images/logo.png';
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

    menuService.addMenuItems([
      {
        label: 'Input Builder (Simple)',
        items: [
          {
            label: 'Input Builder (Works)',
            icon: 'brush',
            routerLink: 'fieldforcemachinedetails'
          }
        ]
      }
    ]);
  }
}
