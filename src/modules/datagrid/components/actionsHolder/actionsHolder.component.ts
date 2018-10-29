import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Action } from '@ngscaffolding/models';

@Component({
  selector: 'app-actions-holder',
  templateUrl: './actionsHolder.component.html',
  styleUrls: ['./actionsHolder.component.scss']
})
export class ActionsHolderComponent implements OnInit {
  @Input() actions: Action[];
  selectedRows: any[];
  selectedRowsCount = 0;

  @Output() actionClicked = new EventEmitter<Action>();

  constructor() {}

  ngOnInit() {}

  clickHandler(action: Action) {
    this.actionClicked.emit(action);
  }
}
