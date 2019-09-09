import { ReferenceValueItem } from '../coreModels';

export class baseInput{
  name?: string;
  label?: string;
  type?: InputTypes;
}

export class testInput extends baseInput {
 textValue: string;
}

export function build () {
  var array: baseInput[];

  array = new  Array<baseInput>();

  var base = new baseInput();
  var test = new testInput();

  array.push(base);
  array.push(test);

  array.forEach(arr=>{
    console.log(arr.name);
  if(arr instanceof testInput){
    console.log((<testInput>arr).textValue);
  }
});
}

export enum InputTypes {
  null = 'null',
  textbox = 'textbox',
  number = 'number',
  email = 'email',
  password = 'password',
  textarea = 'textarea',
  datetime = 'datetime',
  datetimeUTC = 'datetimeUTC',
  date = 'date',
  time = 'time',
  select = 'select',
  switch = 'switch',
  editor = 'editor',
  listbox = 'listbox',
  colourpicker = 'colourpicker',
  spinner = 'spinner',
  slider = 'slider',
  checkbox = 'checkbox',
  tricheckbox = 'tricheckbox',
  selectbutton = 'selectbutton',
  togglebutton = 'togglebutton',
  radio = 'radio',
  radiobuttons = 'radiobuttons',
  dropdown = 'dropdown',
  rating = 'rating',
  autocomplete = 'autocomplete',
  multiselect = 'multiselect',
  chips = 'chips',
  keyfilter = 'keyfilter'
}
export class InputDetail {
  name?: string;
  label?: string;
  type?: InputTypes;
  placeholder?: string;
  help?: string;
  comparison?: string;
  allowcomparisonchange?: string;
  containerClass?: string; // Either full 12 cols or smaller if help present
  classes?: string;
  hidden?: boolean;

  readonly?: boolean;

  value?: any;

  validateRequired?: string; // Providing a message here infer Required
  validateRequiredTrue?: string; // Providing a message here infer RequiredTrue

  validateEmail?: string; // Providing a message here infer RequiredEmail

  validatePattern?: string;
  validatePatternMessage?: string;

  validateMin?: number;
  validateMinMessage?: string;

  validateMax?: number;
  validateMaxMessage?: string;

  validateMinLength?: number;
  validateMinLengthMessage?: string;

  validateMaxLength?: number;
  validateMaxLengthMessage?: string;
}

export class InputDetailTextBox extends InputDetail {
  mask?: string; // 999-999
}

export class InputDetailReferenceValues extends InputDetail {
  referenceValueName?: string; // Used for select items
  referenceValueSeedName?: string; // set to name, when changed use this value in search
  referenceValueChildLevel: number; // Where the Reference data contains children, which level down do we go
  datasourceItems?: Array<ReferenceValueItem>; // Results of the datasource stored here for binding
  referenceValueSeedDependency?: string; // Name of control to use as seed for this DataSource... Used linked Dropdowns
}

export class InputDetailDropdown extends InputDetailReferenceValues {
  selectFilter?: boolean; // Show Filter on Select Dropdown
  selectFilterBy?: string; // Fields to filter by on Select DropDown
  selectFilterPlaceholder?: string; // Placeholder for Filter input
}

export class InputDetailToggleButton extends InputDetail{

}
export class InputDetailTextArea extends InputDetail{
  rows?: number; // Rows for TextArea
}

export class InputDetailSlider extends InputDetail{
  min?: number;
  max?: number;
  step?: number;
}
