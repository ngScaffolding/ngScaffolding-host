import { NgModule, ModuleWithProviders } from '@angular/core';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { UserListComponent } from './pages/userList/userList.component';

import {
  AuthoriseRoleGuard,
  AppSettingsService,
  MenuService,
  LoggingService,
  VersionsService
} from 'ngscaffolding-core';

import { DatagridModule } from 'ngscaffolding-datagrid';

const appRoutes: Routes = [
  { path: 'test', component: UserListComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [UserListComponent],
  exports: [RouterModule]
})
export class UserAdminModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UserAdminModule
    };
  }

  constructor(
    menuService: MenuService,
    logger: LoggingService,
    versions: VersionsService
  ) {
    logger.info('Starting User Admin', 'userAdmin.startup');

    versions.addVersion('@ngscaffolding/userAdmin', VERSION.version, true);


    menuService.addMenuItemsFromCode([
      {
        label: 'Chart Sample',
        icon: 'grid',
            routerLink: 'charttest'
      },
      {
        label: 'DataGrid Samples',
        items: [
          {
            label: 'Data Grid Test',
            icon: 'grid',
            routerLink: 'datagridtest'
          }
        ]
      },
      {
        label: 'Input Builder (Simple)',
        items: [
          {
            label: 'Input Builder (Works)',
            icon: 'brush',
            routerLink: 'inputbuildersimple'
          }
        ]
      }
    ]);
  }
}
