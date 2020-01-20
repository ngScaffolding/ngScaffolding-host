import { WidgetModelBase } from './widget.model';

export interface WidgetDetails {
    // Look up Widget Definition
    widgetName: string;

    // Holds the configured input values. These are passed to the relevant dataSource
    configuredValues?: any;

    // Grid Layout Values
    cols?: number;
    rows?: number;
    x?: number;
    y?: number;

    // Attached at runtime
    widget?: WidgetModelBase;
}
