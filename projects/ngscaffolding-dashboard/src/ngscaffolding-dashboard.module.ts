import { NgModule, ModuleWithProviders, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import {TranslateModule} from '@ngx-translate/core';

import { MenuService, LoggingService, VersionsService, ComponentLoaderService } from 'ngscaffolding-core';
import { CoreModule, AuthoriseRoleGuard } from 'ngscaffolding-core';

import { InputBuilderModule } from 'ngscaffolding-inputbuilder';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WidgetContainerComponent } from './components/widgetContainer/widgetContainer.component';

import { GridsterModule } from 'angular-gridster2';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { ButtonModule, SidebarModule, DialogModule, ConfirmDialogModule, TooltipModule } from 'primeng/primeng';
import { DashboardToolBarComponent } from './components';
import { GalleryComponent } from './components/gallery/gallery.component';
import { HtmlContainerComponent } from './components/htmlContainer/htmlContainer.component';
import { SaveInputComponent } from './components/saveInput/saveInput.component';
import { createCustomElement } from '@angular/elements';

// Services

const appRoutes: Routes = [
  { path: 'dashboard/:id', component: DashboardComponent, canActivate: [AuthoriseRoleGuard]  },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthoriseRoleGuard]  }
];

@NgModule({
  imports: [
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    DialogModule,
    SidebarModule,
    CoreModule.forRoot(),
    CommonModule,
    FormsModule,
    InputBuilderModule,
    GridsterModule,
    CardModule,
    ProgressSpinnerModule,
    RouterModule.forChild(appRoutes),
    TranslateModule.forChild()
  ],
  declarations: [
    DashboardComponent,
    DashboardToolBarComponent,
    HtmlContainerComponent,
    GalleryComponent,
    SaveInputComponent,
    WidgetContainerComponent
  ],
  exports: [
    DashboardComponent,
    DashboardToolBarComponent,
    HtmlContainerComponent,
    WidgetContainerComponent,
    RouterModule
  ],
  providers: [],
  entryComponents: [ HtmlContainerComponent ]
})
export class DashboardModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DashboardModule
    };
  }

  constructor(injector: Injector, versions: VersionsService,
    componentLoaderService: ComponentLoaderService) {
    versions.addVersion('ngscaffolding-dashboard', VERSION.version);

    // Register HTML Container
    const el = createCustomElement(HtmlContainerComponent, { injector });
    customElements.define('ngs-html-container', el);

    componentLoaderService.registerComponent('ngs-html-container');


  }
}
