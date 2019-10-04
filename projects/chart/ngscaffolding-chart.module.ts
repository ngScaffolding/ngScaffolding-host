import { NgModule, ModuleWithProviders, Injector } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import {
  MenuService,
  LoggingService,
  VersionsService,
  ComponentLoaderService
} from 'ngscaffolding-core';
import { AuthoriseRoleGuard } from 'ngscaffolding-core';

import { InputBuilderModule } from 'ngscaffolding-inputbuilder';
import { ChartComponent } from './components/chart/chart.component';
import { ChartHolderComponent } from './components/chartHolder/chartHolder.component';

import { HighchartsChartModule } from 'highcharts-angular';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Services
import { ChartDataService } from './services/chartData.service';
import { TranslateModule } from '@ngx-translate/core';
import { createCustomElement } from '@angular/elements';

// Exports
export { ChartComponent } from './components/chart/chart.component';

const appRoutes: Routes = [
  {
    path: 'chart/:id',
    component: ChartHolderComponent,
    canActivate: [AuthoriseRoleGuard]
  },
  {
    path: 'chart',
    component: ChartHolderComponent,
    canActivate: [AuthoriseRoleGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    InputBuilderModule,
    HighchartsChartModule,
    ProgressSpinnerModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [ChartComponent, ChartHolderComponent],
  exports: [RouterModule, ChartComponent, ChartHolderComponent],
  providers: [ChartDataService],

  entryComponents: [ChartComponent, ChartHolderComponent]
})
export class ChartingModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ChartingModule
    };
  }

  constructor(injector: Injector, componentLoaderService: ComponentLoaderService) {
    // registering our Angular Component
    const el = createCustomElement(ChartComponent, { injector });
    customElements.define('ngs-chart', el);
    componentLoaderService.registerComponent('ngs-chart');

    const el2 = createCustomElement(ChartHolderComponent, { injector });
    customElements.define('ngs-chart-holder', el2);
    componentLoaderService.registerComponent('ngs-chart-holder');
  }
}
