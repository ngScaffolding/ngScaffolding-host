import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { CoreModule, MenuService, LoggingService, VersionsService } from '../core/coreModule';
import { ButtonColorPipe } from '../core/coreModule';

import { InputBuilderModule } from '../inputbuilder/inputbuilderModule';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { GridsterModule } from 'angular-gridster2';

// Services

const appRoutes: Routes = [
  { path: 'dashboard/:id', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputBuilderModule,
    CoreModule,
    GridsterModule,
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
