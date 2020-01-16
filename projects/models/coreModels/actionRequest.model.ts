import { Action } from './action.model';

export class ActionRequestModel {
    action: Action;
    inputDetails: object;
    rows: object[];
}

export class ActionResultModel {
    success: boolean;
    message: string;
}
