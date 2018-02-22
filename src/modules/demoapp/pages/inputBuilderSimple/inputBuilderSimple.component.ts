import { Component } from '@angular/core';
import {
  InputBuilderDefinition,
  InputTypes,
  OrientationValues,
  InputDetailDropdown,
  InputDetailToggleButton,
  InputDetailTextArea,
  InputDetailTextBox
} from '../../../inputbuilder/inputbuilderModule';

@Component({
  templateUrl: 'inputBuilderSimple.component.html',
  styleUrls: ['inputBuilderSimple.component.scss']
})
export class InputBuilderSimpleComponent {
  inputDefinition1: InputBuilderDefinition = {
    orientation: OrientationValues.Horizontal,
    horizontalColumnCount: 3,
    okButtonText: 'Save Me',
    okButtonIcon: 'fa-check',
    cancelButtonText: 'Cancel Me',
    cancelButtonIcon: 'fa-check',

    customButtonText: 'Custom Here',
    customButtonIcon: 'fa-check',
    customButtonCallBack: () => alert('Call Back'),

    inputDetails: [
      <InputDetailTextBox>{
        label: 'Hello',
        name: 'hello',
        value: '',
        type: InputTypes.textbox,
        validateEmail: 'Email Please',
        help: 'Help Me. Please help me Please Mister.',
        validateRequired: 'Please say hello'
      },
      <InputDetailDropdown> {
        label: 'Simple Continents',
        name: 'simpleSelectContinents',
        type: InputTypes.select,
        referenceValueName: 'Continents',
        help: 'Basic Select Only'
      },
       <InputDetailDropdown> {
        label: 'Simple Countries',
        name: 'simpleSelectCountries',
        type: InputTypes.select,
        referenceValueName: 'Countries',
        validateRequired: 'Select Me Please',
        selectFilter: true
      },
      <InputDetailDropdown> {
        label: 'linked Continents',
        name: 'linkedSelectContinents',
        type: InputTypes.select,
        referenceValueName: 'Continents',
        validateRequired: 'Select Me Please',
        help: 'Basic Select Only'
      },
       <InputDetailDropdown> {
        label: 'linked Countries',
        name: 'linkedSelectCountries',
        type: InputTypes.select,
        referenceValueName: 'CountriesForContinent',
        referenceValueSeedDependency: 'linkedSelectContinents',
        validateRequired: 'Select Me Please',
        selectFilter: true
      },
      {
        label: 'Date',
        name: 'date',
        value: new Date('2018-01-13T00:00:00.000Z'),
        type: InputTypes.date,
        validateRequired: 'Date Here Please'
      },
      {
        label: 'DateTime',
        name: 'datetime',
        value: new Date('2018-01-13T00:00:00.000Z'),
        type: InputTypes.datetime
      },
      {
        label: 'Time',
        name: 'time',
        value: new Date('2018-01-13T13:37:00.000Z'),
        type: InputTypes.time
      },
      <InputDetailTextArea>{
        label: 'TextArea',
        name: 'textarea',
        value: 'Lorem ipsum dolor sit amet',
        type: InputTypes.textarea,
        help: 'Enter lots of text here. Lots and lots.',
        rows: 5,
        validateRequired: 'Latin Here Please'
      },
      {
        label: 'CheckBox Here',
        name: 'checkbox',
        value: true,
        type: InputTypes.checkbox
      },
      {
        label: 'Chips Here',
        name: 'chips',
        value: ['one', 'two'],
        type: InputTypes.chips,
        validateRequired: 'Mmmm Chips'
      },
      <InputDetailToggleButton>{
        label: 'Switch Here',
        onLabel: 'On',
        offLabel: 'Off',
        name: 'switch',
        value: true,
        type: InputTypes.switch
      }
    ]
  };

  inputModel1 = { hello: 'Sample', date: '', datetime: '', time: '' };

  inputModel1Changed(model: any) {
    this.inputModel1 = model;
  }

  constructor() {}

  notifyChanged(val: any) {
    var x = 0;
  }
}
