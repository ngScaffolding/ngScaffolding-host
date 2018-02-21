import { Component } from '@angular/core';

import { GridViewDetail, ColumnModel } from '../../../datagrid/datagridModule';

import {
  InputBuilderDefinition,
  InputTypes,
  OrientationValues,
  InputDetailDropdown,
  InputDetailToggleButton,
  InputDetailTextArea,
  InputDetailTextBox
} from '../../../inputbuilder/inputbuilderModule';

@Component({
  templateUrl: 'dataGridSample.component.html',
  styleUrls: ['dataGridSample.component.scss']
})
export class DatagridSampleComponent {
  gridViewDetail: GridViewDetail = {
    title: 'Test Grid',
    columns: [{ field: 'TestField' }],
    selectCommand: 'TestGrid.Select'
  };
  constructor() {}
}
