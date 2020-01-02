import { BaseDataSource, DataSourceTypes } from './base.dataSource.model';
import { ParameterDetail, ParameterTypes } from './parameterDetail.model';

export class SqlDataSource {
    connection: string;
    sqlCommand: string;

    testCommand?: string;
    isStoredProcedure?: boolean;

    parameters?: ParameterDetail[];
}
