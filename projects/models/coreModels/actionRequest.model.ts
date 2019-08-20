import { Action } from '..';

export class ActionRequestModel{
  action: Action;
  inputDetails: string;
  rows: string;
}

export class ActionResultModel
{
    success: boolean;
    message: string;
}
