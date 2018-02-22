import { BaseEntity } from './baseEntity.model';

export class UserPreferenceDefinition extends BaseEntity {
  public inputDetails: string;
  public name: string;
  public value: string;
}

export class UserPreferenceValue extends BaseEntity {
  public name: string;
  public userName: string;
  public userPreferenceId: number;
  public value: string;
}
