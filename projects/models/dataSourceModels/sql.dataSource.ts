import { BaseDataSource, DataSourceTypes } from './base.dataSource.model';

export class SqlDataSource {

  connection: string;
  sqlCommand: string;

  testCommand?: string;
  isStoredProcedure?: boolean;
}
