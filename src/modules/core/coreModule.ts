import { NgModule, ModuleWithProviders } from '@angular/core';
import { VERSION } from './version';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Pipes
import { ButtonColorPipe } from './pipes/index';

// Directives
import { FillHeightDirective } from './directives/fill-height.directive';
import { AuthoriseRoleGuard } from './routeGuards/authoriseRoleGuard';

import { VersionsService } from 'ngscaffolding-core';

export * from './models/index';
export * from './pipes/index';
export * from './routeGuards/authoriseRoleGuard';

// Interfaces

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [
    FillHeightDirective,
    ButtonColorPipe
  ],
  exports: [
    ButtonColorPipe,
    FillHeightDirective
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        AuthoriseRoleGuard
      ]
    };
  }
  constructor(versions: VersionsService) {
    versions.addVersion('@ngscaffolding/core', VERSION.version);
  }
}
