import { WidgetDetails } from "./widgetDetails.model";
import { InputBuilderDefinition } from "../inputBuilderModels";

export interface DashboardModel{
    title: string;

    // Readonly means that the dash cannot change, includes order, size, inputdata
    readOnly?: boolean;
    
    // Denotes the gallery of optional widgets to create
    galleryName: string;

    // How often to update ALL widgets in the dashboard (Time in Sesconds)
    refreshInterval?: number;

    // Input details form Dashboard Config
    inputBuilderDefinition?: InputBuilderDefinition;

    // Holds the configured input values. These are passed to the relevant dataSource
    configuredValues?: any;

    widgets: WidgetDetails[];
}