import { BaseDataSource, DataSourceTypes } from './base.dataSource.model';
import { ParameterDetailModel } from './parameterDetail.model';

export class MySqlDataSource {
  connection: string;
  sqlCommand: string;

  testCommand?: string;
  isStoredProcedure?: boolean;

  parameters?: ParameterDetailModel[];
}
