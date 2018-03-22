export class ColumnModel {
  Field?: string;

  CellClass?: string;
  Filter?: string;
  TooltipField?: string;
  HeaderName?: string;
  HeaderTooltip?: string;
  Pinned?: string; // left or right
  SuppressMenu?: boolean;
  SuppressFilter?: boolean;
  SuppressSorting?: boolean;
  // int minWidth
  // int maxWidth
  Type?: string;
  Hide?: boolean;
  Width?: string;

  CellFormatter?: string;
  CellClassRules?: string;

  // Link & Action Buttons
  DestinationUrl?: string;
  Target?: string;
  ButtonTitle?: string;
  ButtonIcon?: string;
}
