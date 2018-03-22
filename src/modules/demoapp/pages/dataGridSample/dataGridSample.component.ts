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
    Title: 'Test Grid',
    Columns: [{ Field: 'TestField' }],
    SelectCommand: 'TestGrid.Select'
  };
  constructor() {}
}
