import { ParameterDetail } from './parameterDetail.model';
import { InputDetail } from '../inputBuilderModels';
import { RestApiDataSource } from './restApi.dataSource';
import { SqlDataSource } from './sql.dataSource';
import { DocumentDBDataSource } from './documentDB.dataSource';
import { MongoDBDataSource } from './mongoDB.dataSource';

export const enum DataSourceTypes {
  SQL = 'SQL',
  RestApi = 'RestAPI',
  MongoDB = 'MongoDB',
  DocumentDB = 'DocumentDB',
  MySQL = 'MySQL'
}

export const enum SystemDataSourceNames {
  APPLOGS_SELECT = 'system.AppLogs.Select',
  ERRORS_SELECT = 'system.Errors.Select',

  APPSETTINGS_SELECT = 'system.AppSettings.Select',
  APPSETTINGS_DELETE = 'system.AppSettings.Delete',
  APPSETTINGS_UPDATE = 'system.AppSettings.Update',
  APPSETTINGS_CREATE = 'system.AppSettings.Create',

  USERS_SELECT = 'system.Users.Select',
  USERS_GET = 'system.Users.Get',
  USERS_DELETE = 'system.Users.Delete',
  USERS_UPDATE = 'system.Users.Update',
  USERS_CREATE = 'system.Users.Create',
  USERS_REGISTER = 'system.Users.Register',
  USERS_SETPASSWORD = 'system.Users.SetPassword',
  USERS_CHANGEPASSWORD = 'system.Users.ChangePassword',
  USERS_CONFIRMEMAIL = 'system.Users.ConfirmEmail',

  ROLES_SELECT = 'system.Roles.Select',
  ROLES_DELETE = 'system.Roles.Delete',
  ROLES_UPDATE = 'system.Roles.Update',
  ROLES_CREATE = 'system.Roles.Create',

  CLIENTS_SELECT = 'system.Clients.Select',
  CLIENTS_DELETE = 'system.Clients.Delete',
  CLIENTS_UPDATE = 'system.Clients.Update',
  CLIENTS_CREATE = 'system.Clients.Create'
}

export class BaseDataSource {
  name: string;
  type: DataSourceTypes;

  // Expires in Seconds
  expires?: number;

  // Filled by code when retrieved for cache reasons
  whenStored?: Date;

  // timeout in milliseconds
  timeout?: number;

  isPagedData?: boolean;
  isAudit?: boolean;

  // Name Of DataSource to flush on completed
  flushReferenceValues?: string;

  parameters?: ParameterDetail[];
  inputControls?: InputDetail[];

  itemDetails: RestApiDataSource | SqlDataSource | DocumentDBDataSource | MongoDBDataSource;
}
