import { BaseDataSource, DataSourceTypes } from './base.dataSource.model';
import { ParameterDetail } from './parameterDetail.model';

export class MySqlDataSource {
  connection: string;
  sqlCommand: string;

  testCommand?: string;
  isStoredProcedure?: boolean;

  parameters?: ParameterDetail[];
}
