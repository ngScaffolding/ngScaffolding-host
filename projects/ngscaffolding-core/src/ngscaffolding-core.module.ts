import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { VERSION } from './version';

// Pipes
import { ButtonColorPipe } from './pipes/buttonColor.pipe';

// Directives
import { FillHeightDirective } from './directives/fill-height.directive';
import { AuthoriseRoleGuard } from './routeGuards/authoriseRoleGuard';

import { VersionsService } from './services/versions/versions.service';

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
    versions.addVersion('ngscaffolding-core', VERSION.version);
  }
}
