import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { MenuService, LoggingService, VersionsService } from 'ngscaffolding-core';
import { CoreModule, AuthoriseRoleGuard } from 'ngscaffolding-core';

import { InputBuilderModule } from 'ngscaffolding-inputbuilder';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { DataGridComponent } from 'ngscaffolding-datagrid';
import { ChartComponent } from '../../../src/modules/chartModule/chartModule.module';

import { DynamicModule } from 'ng-dynamic-component';

import { GridsterModule } from 'angular-gridster2';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { DataGridModule } from 'primeng/primeng';

// Services

const appRoutes: Routes = [
  { path: 'dashboard/:id', component: DashboardComponent, canActivate: [AuthoriseRoleGuard]  },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthoriseRoleGuard]  }
];

@NgModule({
  imports: [
    CoreModule.forRoot(),
    CommonModule,
    FormsModule,
    InputBuilderModule,
    GridsterModule,
    CardModule,
    ProgressSpinnerModule,
    //DynamicModule.withComponents([DataGridComponent]),
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
    versions.addVersion('@ngscaffolding/dashboard', VERSION.version);
  }
}
