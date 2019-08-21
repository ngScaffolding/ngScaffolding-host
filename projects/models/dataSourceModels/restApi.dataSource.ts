import { BaseDataSource, DataSourceTypes } from './base.dataSource.model';

export interface NameValuePair {
    name: string;
    value: any;
}

export class RestApiDataSource {

    serverName: string;
    url: string;
    verb?: string;
    responseType?: string;

    headerValues?: [NameValuePair];
    bodyValues?: [NameValuePair];
}
