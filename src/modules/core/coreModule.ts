import { NgModule, ModuleWithProviders } from '@angular/core';
import { VERSION } from './version';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppSettingsService } from './services/appSettings/appSettings.service';
import { UserAuthorisationService } from './services/userAuthorisation/userAuthorisation.service';
import { BroadcastService } from './services/broadcast/broadcast.service';
import { CacheService } from './services/cache/cache.service';
import { CoreErrorHandlerService } from './services/coreErrorHandler/coreErrorHandler.service';
import { LoggingService } from './services/logging/logging.service';
import { MenuService } from './services/menu/menu.service';
import { NotificationService } from './services/notification/notification.service';
import { ReferenceValuesService } from './services/referenceValues/refrenceValues.service';
import { UserPreferencesService } from './services/userPreferences/userPreferences.service';
import { SpinnerService } from './services/spinnerService/spinner.service';
import { RolesService } from './services/rolesService/roles.service';
import { VersionsService } from './services/versions/versions.service';

export * from './services/index';
export * from './routeGuards/index';
export * from './models/index';

// Interfaces

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [
    // SampleComponent,
    // SampleDirective,
    // SamplePipe
  ],
  exports: [
    // SampleComponent,
    // SampleDirective,
    // SamplePipe
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        AppSettingsService,
        UserAuthorisationService,
        BroadcastService,
        CacheService,
        CoreErrorHandlerService,
        LoggingService,
        NotificationService,
        MenuService,
        ReferenceValuesService,
        RolesService,
        UserPreferencesService,
        SpinnerService,
        VersionsService
      ]
    };
  }
  constructor(versions: VersionsService) {
    versions.addVersion('@ngscaffolding/core', VERSION.version);
  }
}
