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
    BasicUser,
    ChangePasswordModel
} from 'ngscaffolding-models';
import {
    UserService,
    LoggingService,
    AppSettingsQuery,
    DataSourceService,
    DialogWindowComponent,
    NotificationService
} from 'ngscaffolding-core';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-user-set-password',
    templateUrl: 'set-password.component.html',
    styleUrls: ['set-password.component.scss']
})
export class SetPasswordComponent extends DialogWindowComponent implements OnChanges {
    userInputDefinition: InputBuilderDefinition = {
        orientation: OrientationValues.Horizontal,
        columnCount: 2,
        okButtonText: 'Save',
        okButtonIcon: 'ui-icon-check',
        cancelButtonText: 'Cancel',
        cancelButtonIcon: 'ui-icon-clear',
        inputDetails: [
            {
                label: 'New Password',
                name: 'newPassword',
                type: InputTypes.password
            }
        ]
    };

    @Input() showButtons = false;
    @Input() data: any;
    @Input() idValue: string;

    private user: BasicUser;
    passwordModel: ChangePasswordModel;

    constructor(
        private userService: UserService,
        private translateService: TranslateService,
        private notificationService: NotificationService,
        private appSettingsQuery: AppSettingsQuery,
        private logger: LoggingService
    ) {
        super();
    }

    cancelClicked(event: any) {
        super.cancel(false);
    }

    okClicked(event: any) {
        this.userService.setPassword(this.passwordModel).subscribe(
            result => {
                this.notificationService.showMessage({
                    severity: 'success',
                    summary: 'User',
                    detail: 'Password Set',
                    life: 5000
                });
                super.cancel(null);
            },
            err => {
                this.notificationService.showMessage({
                    severity: 'error',
                    summary: 'User',
                    detail: 'Password Was not set',
                    sticky: true
                });
            }
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.data && changes.data.currentValue) {
            this.passwordModel = { userId: this.data.userId };
        }
    }

    notifyChanged(event: any) {
        this.passwordModel.newPassword = event.newPassword;
    }

    ngAfterViewInit(): void {}
}
