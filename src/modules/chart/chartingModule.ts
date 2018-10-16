import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { CoreModule, MenuService, LoggingService, VersionsService, AuthoriseRoleGuard } from '../core/coreModule';

import { InputBuilderModule } from '../inputbuilder/inputbuilderModule';
import { HighchartsChartComponent } from './components/chart/highcharts-chart.component';
import { ChartComponent } from './components/chart/chart.component';
import { ChartHolderComponent } from './components/chartHolder/chartHolder.component';

import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import more from 'highcharts/highcharts-more.src';

// Services
import { ChartDataService } from './services/chartData.service';

// Exports
export { ChartComponent } from './components/chart/chart.component';

const appRoutes: Routes = [
  { path: 'chart/:id', component: ChartHolderComponent, canActivate: [AuthoriseRoleGuard]  },
  { path: 'chart', component: ChartHolderComponent, canActivate: [AuthoriseRoleGuard]  }
];

export function highchartsModules() {
  // apply Highcharts Modules to this array
  return [more];
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputBuilderModule,
    CoreModule,
    ChartModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [
    ChartComponent,
    ChartHolderComponent,
    HighchartsChartComponent
  ],
  exports: [
    ChartComponent,
    ChartHolderComponent,
    RouterModule
  ],
  providers: [
    ChartDataService,
    { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules } // add as factory to your providers
  ]
})
export class ChartingModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ChartingModule
    };
  }

  constructor(menuService: MenuService, logger: LoggingService, versions: VersionsService) {
    versions.addVersion('@ngscaffolding/chart', VERSION.version);
  }
}
