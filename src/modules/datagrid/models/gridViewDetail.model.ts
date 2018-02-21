import { ColumnModel } from './column.model';
import { InputBuilderDefinition } from '../../inputbuilder/inputbuilderModule';
import { ActionModel } from './action.model';

export class GridViewDetail {
  title: string;
  waitForInput?: boolean;

  pageSize?: number;
  infiniteScroll?: boolean;

  detailUrl?: string;
  detailTarget?: string;

  serverPagination?: boolean;
  serverSorting?: boolean;
  serverGrouping?: boolean;

  defaultSort?: string;

  columns: Array<ColumnModel>;
  configuredColumns?: Array<ColumnModel>;

  filtersLocation?: string;

  filters?: InputBuilderDefinition;

  selectCommand: string;
  deleteCommand?: string;
  updateCommand?: string;
  insertCommand?: string;

  actions?: Array<ActionModel>;
}
