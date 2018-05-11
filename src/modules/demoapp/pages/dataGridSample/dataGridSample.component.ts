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
    title: 'Test Grid',
    columns: [{ Field: 'TestField' }],
    selectDataSourceId: 1
  };
  constructor() {}
}
