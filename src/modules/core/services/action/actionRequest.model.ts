import { ActionModel } from '../../models/action.model';

export class ActionRequestModel{
  action: ActionModel;
  inputDetails: any;
  rows: any[];
}

export class ActionResultModel
{
    success: boolean;
    message: string;
}
