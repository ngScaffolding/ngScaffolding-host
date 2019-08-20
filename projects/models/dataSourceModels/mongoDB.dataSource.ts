import { BaseDataSource } from './base.dataSource.model';

export class MongoDBDataSource extends BaseDataSource {
  connection: string;
  connectionOptions: object;

  databaseName: string;
  collectionName: string;

  find: string;
  aggregatePipeLine: string;

}
