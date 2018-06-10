import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { CoreModule, MenuService, LoggingService, VersionsService } from '../core/coreModule';
import { ButtonColorPipe } from '../core/coreModule';

import { InputBuilderModule } from '../inputbuilder/inputbuilderModule';
import { HighchartsChartComponent } from './components/chart/highcharts-chart.component';
import { ChartComponent } from './components/chart/chart.component';

import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';

// Services
import { ChartDataService } from './services/chartData.service';

const appRoutes: Routes = [
  { path: 'chart/:id', component: ChartComponent },
  { path: 'chart', component: ChartComponent }
];

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
    HighchartsChartComponent
  ],
  exports: [
    ChartComponent,
    RouterModule
  ],
  providers: [
    ChartDataService
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
