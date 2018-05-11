import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Action } from '@ngscaffolding/models';
import { MenuItem } from 'primeng/components/common/menuitem';

@Component({
  selector: 'app-button-cell',
  templateUrl: 'buttonCell.component.html',
  styleUrls: ['buttonCell.component.scss']
})
export class ButtonCellComponent implements ICellRendererAngularComp {
  public cell: any;

  public actions: Action[];
  public splitButton: boolean;

  public splitButtonItems: MenuItem[] = [{
    label: 'hello'
  },{label: 'world'}];

  agInit(params: any): void {
    this.actions = params.actions;
    this.splitButton = params.splitButton;
    this.cell = { row: params.value, col: params.colDef.headerName };

    // if (this.splitButton) {
    //   this.actions.forEach(action => {
    //     if (action.columnButton) {
    //       this.splitButtonItems.push({
    //         label: action.title,
    //         icon: action.icon,
    //         command: () => this.clicked(action)
    //       });
    //     }
    //   });
    // }
  }

  public clicked(action: Action): void {
    console.log('Child Cell Clicked: ' + JSON.stringify(action));
  }

  refresh(): boolean {
    return false;
  }
}
