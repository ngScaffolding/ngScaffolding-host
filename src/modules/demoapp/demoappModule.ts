import { NgModule, ModuleWithProviders } from '@angular/core';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { AppSettings } from 'ngscaffolding-models';

import {
  AppSettingsService,
  MenuService,
  LoggingService, ReferenceValuesService,
  VersionsService
} from 'ngscaffolding-core';

import { InputBuilderModule } from 'ngscaffolding-inputbuilder';
import { carsReferenceValues } from './demoData/cars.data';

import { DatagridModule } from 'ngscaffolding-datagrid';
import { ChartingModule } from 'ngscaffolding-chart';

import { InputBuilderSimpleComponent } from './pages/inputBuilderSimple/inputBuilderSimple.component';
import { ChartSampleComponent } from './pages/chartSample/chartSample.component';

export * from './pages/inputBuilderSimple/inputBuilderSimple.component';

const appRoutes: Routes = [
  { path: 'inputbuildersimple', component: InputBuilderSimpleComponent },
  { path: 'charttest', component: ChartSampleComponent }
];

@NgModule({
  imports: [
    CommonModule,
    InputBuilderModule,
    DatagridModule,
    ChartingModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [InputBuilderSimpleComponent, ChartSampleComponent],
  exports: [InputBuilderSimpleComponent, RouterModule]
})
export class DemoAppModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DemoAppModule
    };
  }

  constructor(
    appSettingsService: AppSettingsService,
    menuService: MenuService,
    logger: LoggingService,
    referenceValuesService: ReferenceValuesService,
    versions: VersionsService
  ) {
    logger.info('Setting Values demoApp.startup');

    versions.addVersion('@ngscaffolding/demoapp', VERSION.version, true);

    appSettingsService.setValue(AppSettings.title , 'ngScaffolding Demo');
    appSettingsService.setValue(AppSettings.iconUrl , '');
    // appSettingsService.setValue(AppSettings.apiHome , 'http://localhost:3000');
    // appSettingsService.setValue(AppSettings.apiAuth , 'http://localhost:3010');
    appSettingsService.setValue(AppSettings.authTokenEndpoint , '/auth/token');
    appSettingsService.setValue(AppSettings.errorLogConsole , true);
    appSettingsService.setValue(AppSettings.errorLogServer , true);
    appSettingsService.setValue(AppSettings.errorShowUser , true);

    // Password complexity
    appSettingsService.setValue(AppSettings.authPasswordMinLength, 8);
    appSettingsService.setValue(AppSettings.authPasswordUpperCase, true);
    appSettingsService.setValue(AppSettings.authPasswordLowerCase, true);
    appSettingsService.setValue(AppSettings.authPasswordNumeric, true);
    appSettingsService.setValue(AppSettings.authPasswordSpecial, false);

    appSettingsService.setValue(AppSettings.inputShowCalendarIcon , true);

    appSettingsService.setValue(AppSettings.showFullMessages , false);
    appSettingsService.setValue(AppSettings.showToastMessages , true);

    appSettingsService.setValue(AppSettings.showProfileSetting , true);
    appSettingsService.setValue(AppSettings.showProfilePicture , true);

    appSettingsService.setValue(AppSettings.authClientId , 'democlient');
    appSettingsService.setValue(AppSettings.authClientSecret , 'secret');
    appSettingsService.setValue(AppSettings.authScope , 'ngscaffoldingAPI');
    appSettingsService.setValue(AppSettings.authShowForgotPassword , true);
    appSettingsService.setValue(AppSettings.authShowRegister , true);
    appSettingsService.setValue(AppSettings.authShowRememberMe , true);
    appSettingsService.setValue(AppSettings.authSaveinLocalStorage , true);
    appSettingsService.setValue(AppSettings.authTermsAndConditions ,
      'Demo Application Your Terms and Conditions Here. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Odio pellentesque diam volutpat commodo sed egestas.');

    referenceValuesService.setReferenceValue(carsReferenceValues);

    menuService.addMenuItemsFromCode([
      {
        label: 'Demo Samples',
        items: [
          {
            label: 'Data Grid Test',
            icon: 'grid',
            routerLink: 'datagridtest'
          },
          {
            name: 'input.builder.simple',
            label: 'Input Builder',
            icon: 'brush',
            routerLink: 'inputbuildersimple'
          }
        ]
      }
    ]);
  }
}
