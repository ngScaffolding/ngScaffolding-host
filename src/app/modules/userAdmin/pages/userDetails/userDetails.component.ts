import { Component, SimpleChanges, AfterViewInit, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserModel, InputBuilderDefinition, OrientationValues, InputDetailTextBox, InputTypes, InputDetailDropdown, AppSettings, InputDetail, InputDetailReferenceValues, SystemDataSourceNames } from 'ngscaffolding-models';
import { UserService, LoggingService, AppSettingsQuery } from 'ngscaffolding-core';

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

  @Input() data: any;

  private userId: string;
  private user: IUserModel;
  constructor(private route: ActivatedRoute,
    private appSettingsQuery: AppSettingsQuery,
     private userService: UserService, private logger: LoggingService) {
    console.log('userDetails Constructor');
  }

  ngOnInit(): void {
    const userIsEmail =  this.appSettingsQuery.getEntity(AppSettings.authUserIdIsEmail);

    if (!userIsEmail) {
      this.userInputDefinition.inputDetails = [
        <InputDetailTextBox>{
          label: 'User ID',
          name: 'userId',
          value: '',
          type: InputTypes.textbox,
          validateEmail: 'Email is not correct format',
          validateRequired: 'User ID is required'
        },
        <InputDetail>{
          type: InputTypes.null
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
        <InputDetailReferenceValues>{
          label: 'User Roles',
          name: 'roles',
          type: 'multiselect',
          datasourceItems: [
            { display: 'User', value: 'User'},
            { display: 'Admin', value: 'Admin'}
          ]
        }
      ]
    }
   }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data && changes.data.currentValue) {
    }
  }

  notifyChanged(event: any) {

  }


  ngAfterViewInit(): void {

  }
}
