import { NgModule, ModuleWithProviders } from '@angular/core';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { AppSettings } from '@ngscaffolding/models';

import { AppSettingsService, MenuService, LoggingService, VersionsService, AuthoriseRoleGuard } from '../core/coreModule';

import { InputBuilderModule } from '../inputbuilder/inputbuilderModule';

import { DatagridModule } from '../datagrid/datagridModule';

export * from './pages';

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
export class SpotAdminAppModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SpotAdminAppModule
    };
  }

  constructor(
    appSettingsService: AppSettingsService,
    menuService: MenuService,
    logger: LoggingService, versions: VersionsService
  ) {
    logger.info('Setting Values', 'COREAdmin.startup');

    versions.addVersion('SPOTAdmin', VERSION.version, true);

    const settings: AppSettings = new AppSettings();
    settings.title = 'SPOT Admin Application';
    settings.iconUrl = '';
    settings.apiHome = 'http://localhost:3000';
    settings.apiAuth = 'http://localhost:50020';
    settings.errorLogConsole = true;
    settings.errorLogServer = true;
    settings.errorShowUser = true;

    settings.inputShowCalendarIcon = true;

    settings.showFullMessages = false;
    settings.showToastMessages = true;


    settings.showProfileSetting = false;
    settings.showUserSetting = false;
    settings.showProfilePicture = false;

    settings.authClientId = 'ngscaffolding_client';
    settings.authClientSecret = 'secret';
    settings.authScope = 'ngscaffoldingAPI';
    settings.authShowForgotPassword = true;
    settings.authShowRegister = true;
    settings.authShowRememberMe = true;
    settings.authSaveinLocalStorage = true;
    settings.authTermsAndConditions =
      'Demo Application Your Terms and Conditions Here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

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
