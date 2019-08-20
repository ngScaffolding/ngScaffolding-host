import { BaseDataSource, DataSourceTypes } from './base.dataSource.model';

export class DocumentDBDataSource {

  connection: string;

  databaseName: string;
  collectionName: string;

  sqlCommand: string;
}
