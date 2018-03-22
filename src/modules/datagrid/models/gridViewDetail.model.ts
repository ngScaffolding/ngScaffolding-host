import { ColumnModel } from './column.model';
import { InputBuilderDefinition } from '../../inputbuilder/inputbuilderModule';
import { ActionModel } from './action.model';

export class GridViewDetail {
  Title: string;
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

  SelectCommand: string;
  DeleteCommand?: string;
  UpdateCommand?: string;
  InsertCommand?: string;

  Actions?: Array<ActionModel>;
}
