import { NgModule, ModuleWithProviders } from '@angular/core';
import { VERSION } from './version';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { CoreModule, MenuService, LoggingService, VersionsService } from '../core/coreModule';
import { ButtonColorPipe } from '../core/coreModule';

import { InputBuilderModule } from '../inputbuilder/inputbuilderModule';

import { FiltersHolderComponent } from './components/filtersHolder/filtersHolder.component';
import { DataGridComponent } from './components/dataGrid/dataGrid.component';
import { ActionsHolderComponent } from './components/actionsHolder/actionsHolder.component';
import { ToolBarComponent } from './components/toolBar/toolBar.component';

import { ButtonModule, TooltipModule, ConfirmDialogModule, SplitButtonModule } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular/main';

import { ButtonCellComponent } from './cellTemplates/buttonCell/buttonCell.component';
import { ActionsPipe } from './pipes/actionsPipe/actions.pipe';

const appRoutes: Routes = [
  { path: 'datagrid/:id', component: DataGridComponent },
  { path: 'datagrid', component: DataGridComponent }
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
    AgGridModule.withComponents(
      [
        ButtonCellComponent
      ]),
    RouterModule.forChild(appRoutes)
  ],
  declarations: [
    ActionsHolderComponent,
    DataGridComponent,
    FiltersHolderComponent,
    ToolBarComponent,
    ButtonCellComponent,
    ActionsPipe
  ],
  exports: [
    DataGridComponent,
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
