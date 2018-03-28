import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActionModel } from '../../models';
import { ButtonColorPipe } from '../../../core/coreModule';

@Component({
  selector: 'actions-holder',
  templateUrl: './actionsHolder.component.html',
  styleUrls: ['./actionsHolder.component.scss']
})
export class ActionsHolderComponent implements OnInit {
  @Input() actions: ActionModel[];

  @Output() actionClicked = new EventEmitter<ActionModel>();

  constructor() {}

  ngOnInit() {}

  clickHandler(action: ActionModel) {
    this.actionClicked.emit(action);
  }
}
