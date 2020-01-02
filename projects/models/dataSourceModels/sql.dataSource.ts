import { BaseDataSource, DataSourceTypes } from './base.dataSource.model';
import { ParameterDetail, ParameterTypes } from './parameterDetail.model';
const sql = require('mssql');

export class SqlDataSource {
    connection: string;
    sqlCommand: string;

    testCommand?: string;
    isStoredProcedure?: boolean;

    parameters?: ParameterDetail[];
}

export function getParameterType(parameter: ParameterDetail) {
    switch (parameter.type) {
        case ParameterTypes.String: {
            return sql.NVarChar;
        }
        case ParameterTypes.Number: {
            return sql.Int;
        }
        case ParameterTypes.Boolean: {
            return sql.Bit;
        }
        case ParameterTypes.Date: {
            return sql.DateTime;
        }
        case ParameterTypes.Binary: {
            return sql.VarBinary;
        }
        default:
            return sql.NVarChar;
    }
}
