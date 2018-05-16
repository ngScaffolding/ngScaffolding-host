import { InputBuilderDefinition } from '@ngscaffolding/models';

import * as Highcharts from 'highcharts/highstock';

export interface ChartDetailModel {
  title: string;

  filters?: InputBuilderDefinition;

  chartOptions: Highcharts.Chart;

  dataSourceId?: number;
}
