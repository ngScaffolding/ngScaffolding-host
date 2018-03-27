import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChange
} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InputDetail, InputTypes } from '../models/inputDetail.model';
import {
  InputBuilderDefinition,
  OrientationValues
} from '../models/inputBuilderDefinition.model';

import {
  AppSettingsService,
  ReferenceValuesService,
  ReferenceValueItem,
  ReferenceValue
} from '../../core/coreModule';
import { InputDetailReferenceValues } from '../models/inputDetail.model';

@Component({
  selector: 'input-builder',
  templateUrl: 'inputBuilder.component.html',
  styleUrls: ['inputBuilder.component.scss']
})
export class InputBuilderComponent implements OnInit, OnChanges {
  @Input() inputDefinition: InputBuilderDefinition;
  @Input() inputModel: any;

  @Output() modelUpdated = new EventEmitter<any>();
  @Output() valueUpdated = new EventEmitter<[string, any]>();

  @Output() okClicked = new EventEmitter<any>();
  @Output() cancelClicked = new EventEmitter<any>();

  private clonedInputModel: any;

  form: FormGroup;
  controlStyle = 'ui-g-12';
  inputContainerClass = 'ui-g-12'; // This changes to allow the help Icon

  constructor(
    public appSettings: AppSettingsService,
    public refValuesService: ReferenceValuesService
  ) {}

  onSubmit(form: any) {
    this.okClicked.emit();
  }

  onCancel() {
    this.cancelClicked.emit();
  }

  onCustom() {
    if (this.inputDefinition.customButtonCallBack) {
      this.inputDefinition.customButtonCallBack();
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.buildForm();
  }

  ngOnInit(): void {
    // setup the form
    this.buildForm();
  }

  private buildForm() {
    // Clone our inputModel

    this.clonedInputModel = Object.assign({}, this.inputModel);

    // Default to full width (changes if help found)
    this.inputContainerClass = 'ui-g-12';

    if (this.inputDefinition.orientation === OrientationValues.Horizontal) {
      if (
        this.inputDefinition.horizontalColumnCount > 0 &&
        this.inputDefinition.horizontalColumnCount < 5
      ) {
        const colSize = 12 / this.inputDefinition.horizontalColumnCount;
        this.controlStyle = `ui-g-${colSize}`;
      }
    } else {
      this.controlStyle = 'ui-g-12';
    }
    const formGroup = {};

    if (this.inputDefinition.inputDetails) {
      this.inputDefinition.inputDetails.forEach(inputDetail => {
        inputDetail.containerClass = inputDetail.help ? 'ui-g-11' : 'ui-g-12';

        // Get value from model and apply to new FormControl
        let inputValue: any = null;
        if (this.clonedInputModel[inputDetail.name]) {
          // If we have a passed value in the model, set the control value to this
            inputValue = this.parseValue(inputDetail, this.clonedInputModel[inputDetail.name]);
        } else if (inputDetail.value) {
          // If we have a value passed in the Input definition set the control value to this.
          inputValue = inputDetail.value;
          this.clonedInputModel[inputDetail.name] = inputDetail.value;
        } else {
          // This ensures that the property is set if not passed in
          this.clonedInputModel[inputDetail.name] = null;
        }


        const formControl = new FormControl(
          inputValue,
          this.mapValidators(inputDetail)
        ); // Validators passed here too

        formControl.valueChanges.subscribe(changes => {
          this.fieldChanged(inputDetail, changes);
        });

        formGroup[inputDetail.name] = formControl;

        // If Datasource, get the values
        if (inputDetail.hasOwnProperty('referenceValueName') &&
          (<InputDetailReferenceValues>inputDetail).referenceValueName) {
          this.loadDataSource(inputDetail).subscribe(_ => {

            // Now we have the values, find the ReferenceValue that matches the inputValue from above
            if (this.clonedInputModel[inputDetail.name] && (<InputDetailReferenceValues>inputDetail).datasourceItems) {

              const foundInputValue = (<InputDetailReferenceValues>inputDetail)
                .datasourceItems.find(ds => ds.value === inputValue);

              if (foundInputValue) {
                formControl.setValue(foundInputValue, { onlySelf: true, emitEvent: true });
              }
            }

          });
        }

      });
    }

    this.form = new FormGroup(formGroup);

    this.form.valueChanges.subscribe(changes => {
      this.formChanges(changes);
    });
  }

  private parseValue(inputDetail: InputDetail, value: string): any {
    switch (inputDetail.type) {
      case InputTypes.checkbox:
      case InputTypes.switch:
      {
        return value === 'true';
      }
    }

    // Default just pass back original
    return value;
  }

  private fieldChanged(inputDetail: InputDetail, value: any) {
    let strValue = value.toString();

    if (value.hasOwnProperty('value')) {
      strValue = value.value;
      this.valueUpdated.emit([inputDetail.name, strValue]);
    } else {
      this.valueUpdated.emit([inputDetail.name, value]);
    }

    // Do We need to notify another input of this change?
    this.inputDefinition.inputDetails.forEach(input => {
      if (
        input.hasOwnProperty('referenceValueSeedDependency') &&
        (<InputDetailReferenceValues>input).referenceValueSeedDependency &&
        (<InputDetailReferenceValues>input).referenceValueSeedDependency ===
          inputDetail.name
      ) {
        this.loadDataSource(input, strValue);
      }
    });
  }

  private loadDataSource(inputDetail: InputDetail, seed: string = ''): Observable<ReferenceValue> {
    const obs = this.refValuesService
      .getReferenceValue(
        (<InputDetailReferenceValues>inputDetail).referenceValueName,
        seed
      );

      obs.subscribe(refValue => {
        (<InputDetailReferenceValues>inputDetail).datasourceItems =
          refValue.referenceValueItems;
      });
      return obs;
  }

  private formChanges(changes: any) {
    // Find out What has Changed
    // Object.keys(changes).forEach(key => {
    //   let extractedValue: any;
    //   const property = changes[key];
    //   if (property && property.hasOwnProperty('value')) {
    //     extractedValue = property.value;
    //   } else {
    //     extractedValue = property;
    //   }

    //   if(this.clonedInputModel[key] !== extractedValue) {
    //     // Value has Changed, tell the world
    //     this.valueUpdated.emit(property);
    //   }
    // });


    this.clonedInputModel = changes;

    // Flatten out Objects to value
    const localFlat = Object.assign({}, changes);
    for (const property in localFlat) {
      if (localFlat[property] && localFlat[property].hasOwnProperty('value')) {
        localFlat[property] = localFlat[property].value;
      }
    }

    // Tell subscribers we have changes
    this.modelUpdated.emit(localFlat);
  }

  private mapValidators(inputDetail: InputDetail) {
    const formValidators = [];

    if (inputDetail) {
      // Required
      if (inputDetail.validateRequired) {
        formValidators.push(Validators.required);
      }

      // RequiredTrue
      if (inputDetail.validateRequiredTrue) {
        formValidators.push(Validators.requiredTrue);
      }

      // EMail
      if (inputDetail.validateEmail) {
        formValidators.push(Validators.email);
      }

      // Pattern
      if (inputDetail.validatePattern) {
        formValidators.push(Validators.pattern(inputDetail.validatePattern));
      }

      // Min Length
      if (inputDetail.validateMinLength) {
        formValidators.push(
          Validators.minLength(inputDetail.validateMinLength)
        );
        if (!inputDetail.validateMinLengthMessage) {
          inputDetail.validateMinLengthMessage = `${
            inputDetail.label
          } must be a minimum length of ${inputDetail.validateMinLength}`;
        }
      }

      // Max Length
      if (inputDetail.validateMaxLength) {
        formValidators.push(
          Validators.maxLength(inputDetail.validateMaxLength)
        );
        if (!inputDetail.validateMaxLengthMessage) {
          inputDetail.validateMaxLengthMessage = `${
            inputDetail.label
          } must be a max length of ${inputDetail.validateMinLength}`;
        }
      }
    }

    return formValidators;
  }
}
