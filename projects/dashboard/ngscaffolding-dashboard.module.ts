import { NgModule, ModuleWithProviders, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { VersionsService, ComponentLoaderService } from 'ngscaffolding-core';
import { CoreModule, AuthoriseRoleGuard } from 'ngscaffolding-core';

import { InputBuilderModule } from 'ngscaffolding-inputbuilder';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WidgetContainerComponent } from './components/widgetContainer/widgetContainer.component';
import { ColourBoxComponent } from './components/colourBox/colourBox.component';

import { GridsterModule } from 'angular-gridster2';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { DashboardToolBarComponent } from './components';
import { GalleryComponent } from './components/gallery/gallery.component';
import { HtmlContainerComponent } from './components/htmlContainer/htmlContainer.component';
import { SaveInputComponent } from './components/saveInput/saveInput.component';
import { createCustomElement } from '@angular/elements';

// Services

const appRoutes: Routes = [
    { path: 'dashboard/:id', component: DashboardComponent, canActivate: [AuthoriseRoleGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthoriseRoleGuard] }
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
        WidgetContainerComponent,
        ColourBoxComponent
    ],
    exports: [
        DashboardComponent,
        DashboardToolBarComponent,
        HtmlContainerComponent,
        WidgetContainerComponent,
        RouterModule
    ],
    providers: [],
    entryComponents: [HtmlContainerComponent, ColourBoxComponent]
})
export class DashboardModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DashboardModule
        };
    }

    constructor(injector: Injector, versions: VersionsService, componentLoaderService: ComponentLoaderService) {
        versions.addVersion('ngscaffolding-dashboard', VERSION.version);

        // Register HTML Container
        customElements.define('ngs-html-container', createCustomElement(HtmlContainerComponent, { injector }));
        componentLoaderService.registerComponent('ngs-html-container');

        customElements.define('ngs-colour-box', createCustomElement(ColourBoxComponent, { injector }));
        componentLoaderService.registerComponent('ngs-colour-box');
    }
}
