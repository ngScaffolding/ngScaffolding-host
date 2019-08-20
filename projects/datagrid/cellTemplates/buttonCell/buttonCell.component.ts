import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Action } from 'ngscaffolding-models';
import { MenuItem } from 'primeng/components/common/menuitem';
import { BroadcastService } from 'ngscaffolding-core';

export interface ActionClickedData {
  action: Action;
  row: any;
}

@Component({
  selector: 'app-button-cell',
  templateUrl: 'buttonCell.component.html',
  styleUrls: ['buttonCell.component.scss']
})
export class ButtonCellComponent implements ICellRendererAngularComp {
  constructor(private broadcast: BroadcastService) {}
  public cell: any;

  public actions: Action[];
  public splitButton: boolean;

  agInit(params: any): void {

    this.actions = [];
    for (const action of params.actions) {

      if(action.columnButton){
        this.actions.push(action);
      }
    }
    this.cell = { row: params.data, col: params.colDef.headerName };
  }

  public clicked(action: Action): void {
    this.broadcast.broadcast('ACTION_CLICKED', {
      action: action,
      row: this.cell.row
    } as ActionClickedData);
  }

  refresh(): boolean {
    return false;
  }
}
