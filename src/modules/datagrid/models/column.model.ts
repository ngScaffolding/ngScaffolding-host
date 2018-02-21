export class ColumnModel {
  field?: string;

  cellClass?: string;
  filter?: string;
  tooltipField?: string;
  headerName?: string;
  headerTooltip?: string;
  pinned?: string; // left or right
  suppressMenu?: boolean;
  suppressFilter?: boolean;
  suppressSorting?: boolean;
  // int minWidth
  // int maxWidth
  type?: string;
  hide?: boolean;
  width?: string;

  cellFormatter?: string;
  cellClassRules?: string;

  // Link & Action Buttons
  destinationUrl?: string;
  target?: string;
  buttonTitle?: string;
  buttonIcon?: string;
}
