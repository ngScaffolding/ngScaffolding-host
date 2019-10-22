import { APP_INITIALIZER } from '@angular/core';
import { AppSettingsService, MenuService } from 'ngscaffolding-core';
import { environment } from '../src/environments/environment';
import { buildMenu } from '../src/app/app.commonMenu';

const appInitializerFn = (appConfig: AppSettingsService, menuService: MenuService) => {
  return () => {
    return new Promise((resolve, reject) => {
      appConfig.setValues(environment.appConfig);
      buildMenu(menuService);
      resolve();
    });
  };
};

export const appInitialisers = [
  {
    provide: APP_INITIALIZER,
    useFactory: appInitializerFn,
    multi: true,
    deps: [AppSettingsService, MenuService]
  }
];
