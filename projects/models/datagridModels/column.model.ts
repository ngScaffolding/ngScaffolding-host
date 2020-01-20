export class ColumnModel {
    field?: string;

    cellClass?: string;
    tooltipField?: string;
    headerName?: string;
    headerTooltip?: string;
    pinned?: string; // left or right
    suppressMenu?: boolean;
    filter?: boolean;
    sortable?: boolean;

    // dateTimeColumn, dateColumn, numericColumn
    type?: string;
    hide?: boolean;
    width?: number;

    // Register the below in gridExtensions Service
    // javascript function to format value display
    valueFormatter?: string;
    // angular component that allows full-html rendering in a cell
    cellRenderer?: string;

    cellClassRules?: string;

    // Link & Action Buttons
    destinationUrl?: string;
    target?: string;
    buttonTitle?: string;
    buttonIcon?: string;
}
