import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActionModel } from '@ngscaffolding/models';
import { ButtonColorPipe } from '../../../core/coreModule';

@Component({
  selector: 'actions-holder',
  templateUrl: './actionsHolder.component.html',
  styleUrls: ['./actionsHolder.component.scss']
})
export class ActionsHolderComponent implements OnInit {
  @Input() actions: ActionModel[];
  selectedRows: any[];
  selectedRowsCount = 0;

  @Output() actionClicked = new EventEmitter<ActionModel>();

  constructor() {}

  ngOnInit() {}

  clickHandler(action: ActionModel) {
    this.actionClicked.emit(action);
  }
}
