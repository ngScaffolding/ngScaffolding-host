import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VERSION } from './version';

// Pipes
import { ButtonColourPipe, NgsDateTimePipe, NgsDatePipe } from './pipes/index';

// Directives
import { FillHeightDirective } from './directives/index';

// Services
import { ActionService, AppSettingsService, LoggingService } from './services/index';

import { VersionsService } from './services/versions/versions.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [
    FillHeightDirective,
    ButtonColourPipe,
    NgsDatePipe, NgsDateTimePipe
  ],
  exports: [
    ButtonColourPipe,
    NgsDatePipe, NgsDateTimePipe,
    FillHeightDirective
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule
    };
  }
  constructor(versions: VersionsService) {
    versions.addVersion('ngscaffolding-core', VERSION.version);
  }
}
