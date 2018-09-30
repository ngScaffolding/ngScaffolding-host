import { NgModule, ModuleWithProviders } from '@angular/core';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { CoreModule, MenuService, LoggingService, VersionsService, AuthoriseRoleGuard } from '../core/coreModule';
import { ButtonColorPipe } from '../core/coreModule';

import { InputBuilderModule } from '../inputbuilder/inputbuilderModule';

import { FiltersHolderComponent } from './components/filtersHolder/filtersHolder.component';
import { ActionsHolderComponent } from './components/actionsHolder/actionsHolder.component';
import { ToolBarComponent } from './components/toolBar/toolBar.component';

import { ButtonModule, TooltipModule, ConfirmDialogModule, SplitButtonModule } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular/main';

import { ButtonCellComponent } from './cellTemplates/buttonCell/buttonCell.component';
import { ActionsPipe } from './pipes/actionsPipe/actions.pipe';
import { CardModule } from 'primeng/card';
import { DataGridComponent } from './components/dataGrid/dataGrid.component';
import { DataGridHolderComponent } from './components/dataGridHolder/dataGridHolder.component';
import { ColumnPickerComponent } from './components/columnPicker/columnPicker.component';

const appRoutes: Routes = [
  { path: 'datagrid/:id', component: DataGridHolderComponent, canActivate: [AuthoriseRoleGuard] , children: [

  ] }
  ,{ path: 'toolbar', component: ToolBarComponent, outlet: 'popup' }
];

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule,
    InputBuilderModule,
    ConfirmDialogModule,
    SplitButtonModule,
    CoreModule,
    CardModule,
    AgGridModule.withComponents(
      [
        ButtonCellComponent
      ]),
    RouterModule.forChild(appRoutes)
  ],
  declarations: [
    ActionsHolderComponent,
    DataGridComponent,
    DataGridHolderComponent,
    ColumnPickerComponent,
    FiltersHolderComponent,
    ToolBarComponent,
    ButtonCellComponent,
    ActionsPipe
  ],
  exports: [
    DataGridComponent,
    DataGridHolderComponent,
    RouterModule
  ]
})
export class DatagridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DatagridModule
    };
  }

  constructor(menuService: MenuService, logger: LoggingService, versions: VersionsService) {
    versions.addVersion('@ngscaffolding/dataGrid', VERSION.version);
  }
}
