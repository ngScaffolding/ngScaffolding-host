import { InputDetail } from '../../inputbuilder/inputbuilderModule';

export class ActionModel {
  id: number;
  name?: string;
  type?: string;
  title?: string;
  icon?: string;
  colour?: string;

  // Does this Action appear in a Grid column?
  columnButton?: boolean;

  // Do we need to have atleast one Soure selected?
  selectionRequired?: boolean;

  // After Action completes, remove these DataSources from cache
  flushDataSource?: string;

  // Does the action work on multiple rows?
  multipleTarget?: boolean;

  // Message to show on Confirmation of Action
  confirmationMessage?: string;

  idField?: string;
  idValue?: string;
  entityType?: string;
  additionalProperties?: string;
  inputControls?: Array<InputDetail>;
  refresh?: boolean;

  isAudit?: boolean;

  // Done message
  success?: string;
  // Not done
  error?: string;

  // For SQL this contains the SQL Command ID
  dataSourceId?: number;

  // Angular Controller content
  // Todo?: Not sure if we need this - Maybe just a route?
  controller?: string;
  templateUrl?: string;

  // Standard Url
  url?: string;
  target?: string;
}
