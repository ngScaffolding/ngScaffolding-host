import { NgModule, ModuleWithProviders } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { MenuService, LoggingService, VersionsService,  } from 'ngscaffolding-core';
import { CoreModule, AuthoriseRoleGuard } from 'ngscaffolding-core';

import { InputBuilderModule } from 'ngscaffolding-inputbuilder';
import { ChartComponent } from './components/chart/chart.component';
import { ChartHolderComponent } from './components/chartHolder/chartHolder.component';

import { HighchartsChartModule } from 'highcharts-angular';
import { ProgressSpinnerModule } from 'primeng/primeng';

// Services
import { ChartDataService } from './services/chartData.service';

// Exports
export { ChartComponent } from './components/chart/chart.component';

const appRoutes: Routes = [
  { path: 'chart/:id', component: ChartHolderComponent, canActivate: [AuthoriseRoleGuard]  },
  { path: 'chart', component: ChartHolderComponent, canActivate: [AuthoriseRoleGuard]  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputBuilderModule,
    CoreModule,
    HighchartsChartModule,
    ProgressSpinnerModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [
    ChartComponent,
    ChartHolderComponent
  ],
  exports: [
    ChartComponent,
    ChartHolderComponent,
    RouterModule
  ],
  providers: [
    ChartDataService ]
})
export class ChartingModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ChartingModule
    };
  }

  constructor(menuService: MenuService, logger: LoggingService, versions: VersionsService) {
  }
}
