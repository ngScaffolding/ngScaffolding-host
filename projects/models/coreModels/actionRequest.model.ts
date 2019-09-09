import { Action } from '..';

export class ActionRequestModel{
  action: Action;
  inputDetails: object;
  rows: object[];
}

export class ActionResultModel
{
    success: boolean;
    message: string;
}
