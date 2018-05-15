import { NgModule, ModuleWithProviders } from '@angular/core';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { CoreModule, MenuService, LoggingService, VersionsService } from '../core/coreModule';
import { ButtonColorPipe } from '../core/coreModule';

import { InputBuilderModule } from '../inputbuilder/inputbuilderModule';

import { ChartComponent } from './components/chart/chart.component';

const appRoutes: Routes = [
  { path: 'chart/:id', component: ChartComponent },
  { path: 'chart', component: ChartComponent }
];

@NgModule({
  imports: [
    CommonModule,
    InputBuilderModule,
    CoreModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [
    ChartComponent
  ],
  exports: [
    ChartComponent,
    RouterModule
  ]
})
export class ChartModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ChartModule
    };
  }

  constructor(menuService: MenuService, logger: LoggingService, versions: VersionsService) {
    versions.addVersion('@ngscaffolding/chart', VERSION.version);
  }
}
