import { InputDetail, InputBuilderDefinition } from '../inputBuilderModels';

export const enum ButtonColours {
  primary = 'primary',
  secondary = 'secondary',
  success = 'success',
  info = 'info',
  warning = 'warning',
  danger = 'danger',
  blue = 'blue',
  cyan  = 'cyan',
  teal  = 'teal',
  orange  = 'orange',
  deeporange = 'deeporange',
  purple  = 'purple',
  indigo  = 'indigo',
  pink  = 'pink'
}

export const enum ActionTypes {
  angularComponent = 'angularComponent',
  dataSource = 'dataSource'
}

export class Action {
  id?: number;
  name?: string;
  type?: ActionTypes; // angularComponent
  title?: string;


  icon?: string; // Example ''
  colour?: string;

  // Does this Action appear in a Grid column?
  columnButton?: boolean;

  // Do we need to have atleast one Soure selected?
  selectionRequired?: boolean;

  // After Action completes, remove these DataSources from cache
  flushReferenceValues?: string;

  // Does the action work on multiple rows?
  multipleTarget?: boolean;

  // Message to show on Confirmation of Action
  confirmationMessage?: string;

  idField?: string;
  idValue?: string;
  entityType?: string;
  additionalProperties?: object;
  inputBuilderDefinition?: InputBuilderDefinition;
  refresh?: boolean;

  isAudit?: boolean;

  // Done message
  successMessage?: string;
  successToast?: boolean;
  // Not done
  errorMessage?: string;
  errorToast?: boolean;

  // For SQL this contains the SQL Command ID
  dataSourceName?: string;

  // Angular Controller content
  angularComponent?: string;
  dialogOptions?: DialogOptions;

  // Standard Url
  url?: string;
  target?: string;

  // Notifcation Details - Action Data Posted to Notification
  notificationDetailsName?: string;
}

export class DialogOptions {
  header?: string;
  width?: number;
  height?: number|any;
  maximizable?: boolean;
  closable?: boolean;
}
