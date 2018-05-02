import { Component } from '@angular/core';

import { GridViewDetail, ColumnModel } from '@ngscaffolding/models';

import {
  InputBuilderDefinition,
  InputTypes,
  OrientationValues,
  InputDetailDropdown,
  InputDetailToggleButton,
  InputDetailTextArea,
  InputDetailTextBox
} from '@ngscaffolding/models';

@Component({
  templateUrl: 'dataGridSample.component.html',
  styleUrls: ['dataGridSample.component.scss']
})
export class DatagridSampleComponent {
  gridViewDetail: GridViewDetail = {
    Title: 'Test Grid',
    Columns: [{ Field: 'TestField' }],
    SelectDataSourceId: 1
  };
  constructor() {}
}
