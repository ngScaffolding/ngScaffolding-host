import { BaseEntity } from './baseEntity.model';
import { InputDetail, InputBuilderDefinition } from '../inputBuilderModels';

export enum PreferenceTypes{
  UserPrefs_Profile = 'UserPrefs_Profile'
}

export class UserPreferenceDefinition extends BaseEntity {
  public inputDetails: InputDetail | InputBuilderDefinition;
  public enabled?: boolean;
}

export class UserPreferenceValue extends BaseEntity {
  public userId: string;
  public value: string;
}
