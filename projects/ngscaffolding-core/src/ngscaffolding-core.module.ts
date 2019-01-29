import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { VERSION } from './version';

// Components
import { EditableTitleComponent } from './components';

// Pipes
import { ButtonColorPipe } from './pipes';

// Directives
import { FillHeightDirective } from './directives';

import { VersionsService } from './services/versions/versions.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ButtonModule
  ],
  declarations: [
    EditableTitleComponent,
    FillHeightDirective,
    ButtonColorPipe
  ],
  exports: [
    EditableTitleComponent,
    ButtonColorPipe,
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
