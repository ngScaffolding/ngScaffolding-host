import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
    selector: 'app-button-cell',
    templateUrl: 'buttonCell.component.html',
    styleUrls:['buttonCell.component.scss']
})
export class ButtonCellComponent implements ICellRendererAngularComp {
    private params: any;
    public cell: any;

    agInit(params: any): void {
        this.params = params;
        this.cell = {row: params.value, col: params.colDef.headerName};
    }

    public clicked(cell: any): void {
        console.log("Child Cell Clicked: " + JSON.stringify(cell));
    }

    refresh(): boolean {
        return false;
    }
}
