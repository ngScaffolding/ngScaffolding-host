import { NgModule, ModuleWithProviders, Injector } from '@angular/core';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { MenuService, LoggingService, VersionsService, AuthoriseRoleGuard, CoreModule, NgsDatePipe, NgsDateTimePipe, ButtonColourPipe, ComponentLoaderService } from 'ngscaffolding-core';

import { InputBuilderModule } from 'ngscaffolding-inputbuilder';
import { TranslateModule } from '@ngx-translate/core';

import { FiltersHolderComponent } from './components/filtersHolder/filtersHolder.component';
import { ActionsHolderComponent } from './components/actionsHolder/actionsHolder.component';
import { ToolBarComponent } from './components/toolBar/toolBar.component';

import { ButtonModule, TooltipModule, ConfirmDialogModule, SplitButtonModule, DialogModule, ProgressSpinnerModule, SidebarModule } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular/main';

import { ButtonCellComponent } from './cellTemplates/buttonCell/buttonCell.component';
import { ActionsPipe } from './pipes/actionsPipe/actions.pipe';
import { CardModule } from 'primeng/card';
import { DataGridComponent } from './components/dataGrid/dataGrid.component';
import { DataGridHolderComponent } from './components/dataGridHolder/dataGridHolder.component';
import { ColumnPickerComponent } from './components/columnPicker/columnPicker.component';

// Services
import { GridExtensionsService } from './services/gridExtensions/gridExtensions.service';
import { createCustomElement } from '@angular/elements';

const appRoutes: Routes = [{ path: 'datagrid/:id', component: DataGridHolderComponent, canActivate: [AuthoriseRoleGuard], children: [] }];

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    ButtonModule,
    TooltipModule,
    InputBuilderModule,
    ConfirmDialogModule,
    DialogModule,
    ProgressSpinnerModule,
    SplitButtonModule,
    SidebarModule,
    CardModule,
    TranslateModule,
    AgGridModule.withComponents([ButtonCellComponent]),
    RouterModule.forChild(appRoutes)
  ],
  declarations: [ActionsHolderComponent, DataGridComponent, DataGridHolderComponent, ColumnPickerComponent, FiltersHolderComponent, ToolBarComponent, ButtonCellComponent, ActionsPipe],
  exports: [ButtonCellComponent, DataGridComponent, DataGridHolderComponent, RouterModule],
  providers: [GridExtensionsService, NgsDatePipe, NgsDateTimePipe, GridExtensionsService],
  entryComponents: [DataGridComponent]
})
export class DatagridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DatagridModule
    };
  }

  constructor(injector: Injector, componentLoaderService: ComponentLoaderService, versions: VersionsService) {
    versions.addVersion('ngscaffolding-datagrid', VERSION.version);

    const el = createCustomElement(DataGridComponent, { injector });
    customElements.define('ngs-data-grid', el);
    componentLoaderService.registerComponent('ngs-data-grid');
  }
}
