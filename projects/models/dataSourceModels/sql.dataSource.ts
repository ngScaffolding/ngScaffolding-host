import { ParameterDetail } from './parameterDetail.model';

export class SqlDataSource {
    connection: string;
    sqlCommand: string;

    testCommand?: string;
    isStoredProcedure?: boolean;

    parameters?: ParameterDetail[];
}
