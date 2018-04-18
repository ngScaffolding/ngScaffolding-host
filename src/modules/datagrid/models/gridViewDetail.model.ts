import { ColumnModel } from './column.model';
import { InputBuilderDefinition } from '../../inputbuilder/inputbuilderModule';
import { ActionModel } from './action.model';

export class GridViewDetail {
  Title: string;
  DisableCheckboxSelection?: boolean;
  WaitForInput?: boolean;

  PageSize?: number;
  InfiniteScroll?: boolean;

  DetailUrl?: string;
  DetailTarget?: string;

  ServerPagination?: boolean;
  ServerSorting?: boolean;
  ServerGrouping?: boolean;

  DefaultSort?: string;

  Columns: Array<ColumnModel>;
  ConfiguredColumns?: Array<ColumnModel>;

  FiltersLocation?: string;

  Filters?: InputBuilderDefinition;

  SelectDataSourceId?: number;
  DeleteDataSourceId?: number;
  UpdateDataSourceId?: number;
  InsertDataSourceId?: number;

  Actions?: Array<ActionModel>;
}
