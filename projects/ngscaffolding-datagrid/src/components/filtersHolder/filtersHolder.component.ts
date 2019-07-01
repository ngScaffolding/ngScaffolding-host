import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InputBuilderDefinition } from 'ngscaffolding-models';

@Component({
  selector: 'filters-holder',
  templateUrl: './filtersHolder.component.html',
  styleUrls: ['./filtersHolder.component.scss']
})
export class FiltersHolderComponent implements OnInit {
  @Input() filterDefinition: InputBuilderDefinition;
  @Input() filterValues: any;

  @Output() valuesUpdated = new EventEmitter<any>();
  constructor() {}

  notifyInputsChanged(inputs) {
    this.valuesUpdated.emit(inputs);
  }

  ngOnInit() {}
}
