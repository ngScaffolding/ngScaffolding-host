import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AppSettingsService, AppSettingsQuery, MenuQuery } from 'ngscaffolding-core';
import { CoreMenuItem, InputBuilderDefinition, InputTypes, InputDetailReferenceValues, MenuTypes } from '@ngscaffolding/models';
import { combineLatest } from 'rxjs';

export interface SaveDetails {
  name?: string;
  label?: string;
  parentName?: string;
}
@Component({
  selector: 'ngs-save-input',
  templateUrl: './saveInput.component.html',
  styleUrls: ['./saveInput.component.scss']
})
export class SaveInputComponent implements OnChanges, OnInit {
  @Input() menuDetails: CoreMenuItem;

  @Output() saveMenu = new EventEmitter<SaveDetails>();

  saveDetails: SaveDetails;

  inputDefinition: InputBuilderDefinition = {
    title: 'Save Menu',
    okButtonText: 'Save',
    cancelButtonText: 'Cancel',

    inputDetails: [
      { name: 'name', type: InputTypes.textbox, label: 'Menu Id', validateRequired: 'Id is required' },
      { name: 'label', type: InputTypes.textbox, label: 'Menu Label', validateRequired: 'Label is required' },
      <InputDetailReferenceValues>{ name: 'parentName', type: InputTypes.dropdown, label: 'Parent Menu Id', validateRequired: 'Parent Menu is required' }
    ]
  };

  constructor(private menuQuery: MenuQuery) {}

  ngOnInit(): void {
    combineLatest([this.menuQuery.selectAll(), this.menuQuery.selectLoading()]).subscribe(([menuItems, loading]) => {
      if (menuItems && !loading) {
        const parentItem: InputDetailReferenceValues = this.inputDefinition.inputDetails[2];

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
        name: '',
        label: changes.menuDetails.currentValue.name
      };
    }
  }
}
