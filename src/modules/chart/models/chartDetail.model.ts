import { InputBuilderDefinition } from '@ngscaffolding/models';

import * as Highcharts from 'highcharts/highstock';

export interface ChartDetailModel {
  title: string;

  xAxisName: string;
  seriesNames: string[];

  filters?: InputBuilderDefinition;

  chartOptions: string;

  dataSourceName?: string;
}
