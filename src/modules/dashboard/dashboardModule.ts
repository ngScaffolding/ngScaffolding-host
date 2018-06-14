import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { CoreModule, MenuService, LoggingService, VersionsService, AuthoriseRoleGuard } from '../core/coreModule';
import { ButtonColorPipe } from '../core/coreModule';

import { InputBuilderModule } from '../inputbuilder/inputbuilderModule';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { DataGridComponent } from '../datagrid/components/dataGrid/dataGrid.component';
import { ChartComponent, } from '../chart/components/chart/chart.component';

import { DynamicModule } from 'ng-dynamic-component';

import { GridsterModule } from 'angular-gridster2';
import { CardModule } from 'primeng/card';

// Services

const appRoutes: Routes = [
  { path: 'dashboard/:id', component: DashboardComponent, canActivate: [AuthoriseRoleGuard]  },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthoriseRoleGuard]  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputBuilderModule,
    CoreModule,
    GridsterModule,
    CardModule,
    DynamicModule.withComponents([DataGridComponent, ChartComponent]),
    RouterModule.forChild(appRoutes)
  ],
  declarations: [
    DashboardComponent
  ],
  exports: [
    DashboardComponent,
    RouterModule
  ],
  providers: [

  ]
})
export class DashboardModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DashboardModule
    };
  }

  constructor(menuService: MenuService, logger: LoggingService, versions: VersionsService) {
    versions.addVersion('@ngscaffolding/chart', VERSION.version);
  }
}
