import { BaseEntity } from './baseEntity.model';

export class UserPreferenceDefinition extends BaseEntity {
  public inputDetails: string;
  public value: string;
  public enabled?: boolean;
}

export class UserPreferenceValue extends BaseEntity {
  public userName: string;
  public userPreferenceId: number;
  public value: string;
}
