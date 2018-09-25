import { NgModule, ModuleWithProviders } from '@angular/core';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { AppSettings } from '@ngscaffolding/models';

import { AppSettingsService, MenuService, LoggingService, VersionsService, AuthoriseRoleGuard } from '../core/coreModule';

import { InputBuilderModule } from '../inputbuilder/inputbuilderModule';

import { DatagridModule } from '../datagrid/datagridModule';

// export * from './pages';

const appRoutes: Routes = [
  // { path: 'inputbuildersimple', component: InputBuilderSimpleComponent, canActivate: [AuthoriseRoleGuard]  },
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
    // InputBuilderSimpleComponent
  ],
  exports: [
    // InputBuilderSimpleComponent,
    RouterModule
  ]
})
export class FieldForceAppModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FieldForceAppModule
    };
  }

  constructor(
    appSettingsService: AppSettingsService,
    menuService: MenuService,
    logger: LoggingService, versions: VersionsService
  ) {
    logger.info('Setting Values', 'FieldForce.startup');

    versions.addVersion('FieldForce', VERSION.version, true);

    const settings: AppSettings = new AppSettings();
    settings.title = 'FieldForce Application';
    settings.iconUrl = '/assets/layout/images/logo.png';
    settings.apiHome = 'http://essoft-vm.cloudapp.net:3000';
    settings.apiAuth = 'http://essoft-vm.cloudapp.net:3010';
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

    // menuService.addMenuItems([
    //   {label: 'DataGrid Samples',
    // items: [
    //   {
    //     label: 'Data Grid Test',
    //     icon: 'grid',
    //     routerLink: 'datagridtest'
    //   }
    // ]},
    //   {
    //     label: 'Input Builder (Simple)',
    //     items: [
    //       {
    //         label: 'Input Builder (Works)',
    //         icon: 'brush',
    //         routerLink: 'inputbuildersimple'
    //       }
    //     ]
    //   }
    // ]);
  }
}
