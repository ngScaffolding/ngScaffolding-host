import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export class KeyValue{
  key: string;
  value: string;
}

@Component({
  selector: 'app-details-list',
  templateUrl: 'detailsList.component.html',
  styles: ['detailsList.component.scss']
})
export class DetailsListComponent implements OnChanges {
  @Input() inputValues: any;

  public bindValues: KeyValue[];

  constructor() {
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}): void {
  this.bindValues = [];

  if(changes.inputValues.currentValue){
    // tslint:disable-next-line:forin
    for (let propName in changes.inputValues.currentValue[0]) {
      let newValue = changes.inputValues.currentValue[0][propName];
      this.bindValues.push({key: propName, value: newValue});
  }
  }

}
}
