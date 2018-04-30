import { ActionModel } from '../../models/action.model';

export class ActionRequestModel{
  action: ActionModel;
  inputDetails: string;
  rows: string;
}

export class ActionResultModel
{
    success: boolean;
    message: string;
}
