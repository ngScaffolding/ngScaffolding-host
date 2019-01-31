import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AppSettingsService, AppSettingsQuery } from 'ngscaffolding-core';
import { CoreMenuItem, InputBuilderDefinition, InputTypes } from '@ngscaffolding/models';

export interface SaveDetails {
  name: string;
  label: string;
  parentName?: string;
}
@Component({
  selector: 'ngs-save-input',
  templateUrl: './saveInput.component.html',
  styleUrls: ['./saveInput.component.scss']
})
export class SaveInputComponent implements OnChanges {
  @Input() menuDetails: CoreMenuItem;

  @Output() saveEvent = new EventEmitter<boolean>();
  @Output() saveMenu = new EventEmitter<SaveDetails>();

  saveDetails: SaveDetails;

  inputDefinition: InputBuilderDefinition = {
    title: 'Save Menu',
    okButtonText: 'Save',
    cancelButtonText: 'Cancel',

    inputDetails: [
      { name: 'name', type: InputTypes.textbox, label: 'Menu Id', required: 'Id is required' },
      { name: 'label', type: InputTypes.textbox, label: 'Menu Label', required: 'Label is required' },
      { name: 'parentName', type: InputTypes.select, label: 'Menu Id', required: 'Parent Menu is required' }
    ]
  };

  onModelUpdated(newSaveDetails: SaveDetails) {}

  onOkClciked(event: any) {
    alert('ok');
  }

  onCancelClicked(event: any) {
    alert('cancel');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.menuDetails) {
      this.saveDetails = {
        name: '',
        label: changes.menuDetails.currentValue.name
      };
    }
  }
}
