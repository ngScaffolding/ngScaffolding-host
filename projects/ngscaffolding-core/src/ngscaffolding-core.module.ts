import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VERSION } from './version';

// Pipes
import { ButtonColourPipe } from './pipes/buttonColour.pipe';
import { NgsDateTimePipe } from './pipes/ngsDateTime.pipe';
import { NgsDatePipe } from './pipes/ngsDate.pipe';

// Directives
import { FillHeightDirective } from './directives/fill-height.directive';

// Services
import { VersionsService } from './services/versions/versions.service';

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule],
  declarations: [FillHeightDirective, ButtonColourPipe, NgsDatePipe, NgsDateTimePipe],
  exports: [ButtonColourPipe, NgsDatePipe, NgsDateTimePipe, FillHeightDirective]
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
