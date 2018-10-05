import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChange
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InputBuilderDefinition } from '@ngscaffolding/models';

@Component({
  templateUrl: 'upgradeCalc.component.html',
  styles: ['upgradeCalc.component.scss']
})
export class UpgradeCalcComponent implements OnChanges {

  upgradeInputs: InputBuilderDefinition = {
    okButtonText: 'Calculate'
  };

  constructor() {}

  upgradeChanged

  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {}
}
