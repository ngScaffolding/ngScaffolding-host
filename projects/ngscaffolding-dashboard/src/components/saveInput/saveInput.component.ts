import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AppSettingsService, AppSettingsQuery, MenuQuery } from 'ngscaffolding-core';
import { CoreMenuItem, InputBuilderDefinition, InputTypes, InputDetailReferenceValues, MenuTypes } from '@ngscaffolding/models';
import { combineLatest } from 'rxjs';
import { RolesQuery } from 'projects/ngscaffolding-core/src/services/rolesService/roles.query';

export interface SaveDetails {
  label?: string;
  parentName?: string;
  shareRole?: string;
}
@Component({
  selector: 'ngs-save-input',
  templateUrl: './saveInput.component.html',
  styleUrls: ['./saveInput.component.scss']
})
export class SaveInputComponent implements OnChanges, OnInit {
  @Input() menuDetails: CoreMenuItem;
  @Input() isShareDialog: boolean;

  @Output() saveMenu = new EventEmitter<SaveDetails>();

  saveDetails: SaveDetails;

  inputDefinition: InputBuilderDefinition;

  constructor(private menuQuery: MenuQuery, private rolesQuery: RolesQuery) {}

  ngOnInit(): void {

    if (this.isShareDialog) {
      this.inputDefinition = {
        title: 'Save Menu',
        okButtonText: 'Save',
        cancelButtonText: 'Cancel',
        inputDetails: [
          { name: 'label', type: InputTypes.textbox, label: 'Menu Label', validateRequired: 'Label is required' },
          <InputDetailReferenceValues>{ name: 'parentName', type: InputTypes.dropdown, label: 'Parent Menu Id', validateRequired: 'Parent Menu is required' }
        ]
      };
    } else {
      this.inputDefinition = {
        title: 'Save Menu',
        okButtonText: 'Save',
        cancelButtonText: 'Cancel',
        inputDetails: [
          { name: 'label', type: InputTypes.textbox, label: 'Menu Label', validateRequired: 'Label is required' },
          <InputDetailReferenceValues>{ name: 'parentName', type: InputTypes.dropdown, label: 'Parent Menu Id', validateRequired: 'Parent Menu is required' },
          <InputDetailReferenceValues>{ name: 'shareRole', type: InputTypes.dropdown, label: 'Shared with Role', validateRequired: 'Shared with Role is required' }
        ]
      };

      // Load Roles for sharing diag
      combineLatest([this.rolesQuery.selectAll(), this.rolesQuery.selectLoading()]).subscribe(([roles, rolesLoading]) => {
      if (roles && !rolesLoading) {
        const rolesItem: InputDetailReferenceValues = this.inputDefinition.inputDetails[2];

        rolesItem.datasourceItems = [{ display: '(None)', value: null }];
        roles
          .forEach(loopRole => {
            rolesItem.datasourceItems.push({
              display: loopRole.name,
              value: loopRole.name
            });
          });
      }
    });
    }

    combineLatest([this.menuQuery.selectAll(), this.menuQuery.selectLoading()]).subscribe(([menuItems, menuLoading]) => {
      if (menuItems && !menuLoading) {
        const parentItem: InputDetailReferenceValues = this.inputDefinition.inputDetails[1];

        parentItem.datasourceItems = [{ display: '(None)', value: null }];
        menuItems
          .filter(menu => menu.type === MenuTypes.Folder)
          .forEach(loopMenu => {
            parentItem.datasourceItems.push({
              display: loopMenu.label,
              value: loopMenu.name
            });
          });
      }
    });
  }

  onModelUpdated(newSaveDetails: SaveDetails) {
    this.saveDetails = newSaveDetails;
  }

  onOkClicked(event: any) {
    this.saveMenu.emit(this.saveDetails);
  }

  onCancelClicked(event: any) {
    this.saveMenu.emit(null);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.menuDetails && changes.menuDetails.currentValue) {
      this.saveDetails = {
        label: changes.menuDetails.currentValue.name
      };
    }
  }
}
