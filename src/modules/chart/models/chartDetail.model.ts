import { InputBuilderDefinition } from '@ngscaffolding/models';


export interface ChartDetailModel {
  title: string;

  filters?: InputBuilderDefinition;

   Highsoft.Web.Mvc.Charts.Chart chartOptions { get; set; }

  dataSourceId?: number;
}


export class GridViewDetail {

  disableCheckboxSelection?: boolean;
  waitForInput?: boolean;

  pageSize?: number;
  InfiniteScroll?: boolean;

  detailUrl?: string;
  detailTarget?: string;

  serverPagination?: boolean;
  serverSorting?: boolean;
  serverGrouping?: boolean;

  defaultSort?: string;

  columns: Array<ColumnModel>;
  configuredColumns?: Array<ColumnModel>;
  isActionColumnSplitButton?: boolean;

  filtersLocation?: string;


  selectDataSourceId?: number;
  deleteDataSourceId?: number;
  updateDataSourceId?: number;
  insertDataSourceId?: number;

  actions?: Array<Action>;
}
