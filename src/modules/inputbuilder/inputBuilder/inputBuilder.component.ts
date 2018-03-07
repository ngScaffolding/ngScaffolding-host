import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChange
} from '@angular/core';
import { Observable } from 'rxjs/Rx';-
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InputDetail, InputTypes } from '../models/inputDetail.model';
import {
  InputBuilderDefinition,
  OrientationValues
} from '../models/inputBuilderDefinition.model';

import {
  AppSettingsService,
  ReferenceValuesService,
  ReferenceValueItem
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

        // If Datasource, get the values
        if (inputDetail.hasOwnProperty('referenceValueName') &&
          (<InputDetailReferenceValues>inputDetail).referenceValueName) {
          this.loadDataSource(inputDetail).subscribe(_ => {

            if (this.clonedInputModel[inputDetail.name]) {
              inputValue = (<InputDetailReferenceValues>inputDetail)
            .datasourceItems.find(ds => ds.value.toString() === this.clonedInputModel[inputDetail.name]);
            }

          });
        }else{

        }

        if (this.clonedInputModel[inputDetail.name]) {
          // If we have a passed value in the model, set the control value to this
          if (inputDetail.hasOwnProperty('referenceValueName')) {
            // Datasource type here. Need to set the value to the actual model in the datasource
            inputValue = (<InputDetailReferenceValues>inputDetail)
            .datasourceItems.find(ds => ds.value.toString() === this.clonedInputModel[inputDetail.name]);
            var x =0;
          }else {
            // Standard sting value here
            inputValue = this.clonedInputModel[inputDetail.name];
          }
        } else if (inputDetail.value) {
          // If we have a value passed in the Input definition set the control value to this.
          inputValue = inputDetail.value;
          this.clonedInputModel[inputDetail.name] = inputDetail.value;
        } else {
          // This ensures that the property is set if not passed in
          this.clonedInputModel[inputDetail.name] = null;
        }

        let formControl = new FormControl(
          inputValue,
          this.mapValidators(inputDetail)
        ); // Validators passed here too

        formControl.valueChanges.subscribe(changes => {
          this.fieldChanged(inputDetail, changes);
        });

        formGroup[inputDetail.name] = formControl;
      });
    }

    this.form = new FormGroup(formGroup);

    this.form.valueChanges.subscribe(changes => {
      this.formChanges(changes);
    });
  }

  private fieldChanged(inputDetail: InputDetail, value: any) {
    let strValue = value.toString();

    if (value.hasOwnProperty('value')) {
      strValue = value.value;
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
    this.clonedInputModel = changes;
    // Tell subscribers we have changes
    this.modelUpdated.emit(changes);
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
