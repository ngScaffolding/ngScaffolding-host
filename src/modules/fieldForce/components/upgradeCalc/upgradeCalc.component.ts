import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChange
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'upgradeCalc.component.html',
  styles: ['upgradeCalc.component.scss']
})
export class UpgradeCalcComponent implements OnChanges {
  public bindValues: KeyValue[];

  constructor() {}

  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {}
}
