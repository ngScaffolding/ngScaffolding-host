import { Component, SimpleChanges, AfterViewInit, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    IUserModel,
    InputBuilderDefinition,
    OrientationValues,
    InputDetailTextBox,
    InputTypes,
    InputDetailDropdown,
    AppSettings,
    InputDetail,
    InputDetailReferenceValues,
    SystemDataSourceNames,
    BasicUser
} from 'ngscaffolding-models';
import { UserService, LoggingService, AppSettingsQuery, DataSourceService, DialogWindowComponent } from 'ngscaffolding-core';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-user-set-password',
    templateUrl: 'set-password.component.html',
    styleUrls: ['set-password.component.scss']
})
export class SetPasswordComponent extends DialogWindowComponent implements AfterViewInit, OnInit, OnChanges {
    userInputDefinition: InputBuilderDefinition = {
        orientation: OrientationValues.Horizontal,
        columnCount: 2,
        okButtonText: 'Save',
        okButtonIcon: 'ui-icon-check',
        cancelButtonText: 'Cancel',
        cancelButtonIcon: 'ui-icon-clear'
    };

    @Input() showButtons = false;
    @Input() data: Partial<BasicUser>;
    @Input() idValue: string;

    private user: BasicUser;

    constructor(
        private translateService: TranslateService,
        private dataSourceService: DataSourceService,
        private appSettingsQuery: AppSettingsQuery,
        private logger: LoggingService
    ) {
      super();
    }

    cancelClicked(event: any) {
      super.cancel(false);
    }

    okClicked(event: any) {}
    valueUpdated(event: any) {}

    ngOnInit(): void {
        const userIsEmail = this.appSettingsQuery.getEntity(AppSettings.authUserIdIsEmail);

        if (!userIsEmail) {
            this.userInputDefinition.inputDetails = [
                <InputDetailTextBox>{
                    label: 'User ID',
                    name: 'userId',
                    value: '',
                    type: InputTypes.textbox,
                    validateRequired: 'User ID is required'
                },
                <InputDetailTextBox>{
                    label: 'EMail Address',
                    name: 'email',
                    validateEmail: 'Email is not correct format',
                    type: InputTypes.textbox
                },
                <InputDetailTextBox>{
                    label: 'First Name',
                    name: 'firstName',
                    type: InputTypes.textbox
                },
                <InputDetailTextBox>{
                    label: 'Last Name',
                    name: 'lastName',
                    type: InputTypes.textbox
                },
                <InputDetailTextBox>{
                    label: 'Password',
                    name: 'password',
                    type: InputTypes.password
                },
                <InputDetail>{
                    type: InputTypes.null
                },
                <InputDetailReferenceValues>{
                    label: 'User Roles',
                    name: 'roles',
                    type: 'multiselect',
                    referenceValueName: SystemDataSourceNames.ROLES_SELECT
                }
            ];
        } else {
            this.userInputDefinition.inputDetails = [
                <InputDetailTextBox>{
                    label: 'User ID',
                    name: 'userId',
                    value: '',
                    type: InputTypes.textbox,
                    validateEmail: 'Email Please',
                    validateRequired: 'User ID is required'
                },
                <InputDetailDropdown>{
                    label: 'EMail Address',
                    name: 'email',
                    validateEmail: 'Email is not correct format',
                    type: InputTypes.textbox
                },
                <InputDetailTextBox>{
                    label: 'First Name',
                    name: 'firstName',
                    type: InputTypes.textbox
                },
                <InputDetailTextBox>{
                    label: 'Last Name',
                    name: 'lastName',
                    type: InputTypes.textbox
                },
                <InputDetailTextBox>{
                    label: 'Password',
                    name: 'password',
                    type: InputTypes.password
                },
                <InputDetail>{
                    type: InputTypes.null
                },
                <InputDetailReferenceValues>{
                    label: 'User Roles',
                    name: 'roles',
                    type: 'multiselect',
                    referenceValueName: SystemDataSourceNames.ROLES_SELECT
                }
            ];
        }
    }

    ngOnChanges(changes: SimpleChanges): void {}

    notifyChanged(event: any) {}

    ngAfterViewInit(): void {}
}
