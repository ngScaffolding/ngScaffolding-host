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
import { UserService, LoggingService, AppSettingsQuery, DataSourceService } from 'ngscaffolding-core';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-user-details',
    templateUrl: 'userDetails.component.html',
    styleUrls: ['userDetails.component.scss']
})
export class UserDetailsComponent implements AfterViewInit, OnInit, OnChanges {
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
    private settingPassword = false;
    private okButtonText: string;
    private okButtonIcon: 'ui-icon-check';
    private cancelButtonText: string;
    private cancelButtonIcon: 'ui-icon-clear';
    constructor(
        private translateService: TranslateService,
        private dataSourceService: DataSourceService,
        private appSettingsQuery: AppSettingsQuery,
        private logger: LoggingService
    ) {
      this.okButtonText = translateService.instant('Save');
        this.cancelButtonText = translateService.instant('Cancel');
      }

    cancelClicked(event: any) {
        var x = 0;
    }
    okClicked(event: any) {
        if (this.idValue === 'new') {
            this.dataSourceService
                .getDataSource({
                    name: SystemDataSourceNames.USERS_CREATE,
                    body: this.user,
                    forceRefresh: true
                })
                .subscribe(
                    result => {
                        var x = 0;
                    },
                    err => {
                        var y = 0;
                    }
                );
        } else {
            this.dataSourceService
                .getDataSource({
                    name: SystemDataSourceNames.USERS_UPDATE,
                    inputData: this.data,
                    forceRefresh: true
                })
                .subscribe(
                    result => {},
                    err => {}
                );
        }
    }
    valueUpdated(event: any) {
        if (event[0] === 'password') {
            this.settingPassword = true;
        }
    }

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

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.idValue && changes.idValue.currentValue === 'new') {
            this.data = new BasicUser();
        }
        if (changes.data && changes.data.currentValue) {
        }
        if (changes.showButtons) {
            if (changes.showButtons.currentValue) {
                this.okButtonText = this.translateService.instant('Save');
                this.cancelButtonText = this.translateService.instant('Cancel');
            } else {
                this.okButtonText = null;
                this.cancelButtonText = null;
            }
        }
    }

    notifyChanged(event: any) {
      this.user = event;
    }

    ngAfterViewInit(): void {}
}
