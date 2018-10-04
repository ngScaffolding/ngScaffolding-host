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
import { DetailsListComponent } from './components/detailsList/detailsList.component';

import { ButtonModule } from 'primeng/primeng';
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

// export * from './pages';

const machineDetailsRoute: Route =  { path: 'fieldforcemachinedetails', component: MachineDetailsComponent, outlet: 'popup' };

const appRoutes: Routes = [
  machineDetailsRoute
];

@NgModule({
  imports: [
    CommonModule,
    InputBuilderModule,
    DatagridModule,
    ButtonModule,
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
    RouterModule.forChild(appRoutes)
  ],
  declarations: [
    MachineDetailsComponent,
    DetailsListComponent
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
