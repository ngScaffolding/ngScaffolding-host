import { BaseEntity } from './baseEntity.model';

export class UserPreference extends BaseEntity {
    public userPreferenceId: string;
    public userName: string;
    public preferenceId: string;
    public value: string;
}
