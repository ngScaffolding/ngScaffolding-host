import { InputDetail } from './inputDetail.model';
export const enum OrientationValues {
    Vertical = 'vertical',
    Horizontal = 'horizontal'
}

export const enum InputLocations {
    INLINE = 'inline',
    MODAL = 'modal',
    SIDEBARTOP = 'sidebartop',
    SIDEBARRIGHT = 'sidebarright',
    POPOUT = 'popout'
}

export class InputBuilderDefinition {
    // Title if required
    title?: string;

    // Arrange Controls
    orientation?: OrientationValues;

    // Width in Columns of each control group in horizontal mode
    columnCount?: number;

    // Text to show in OK Button. When empty button is hidden
    okButtonText?: string;
    okButtonIcon?: string;
    okButtonCallBack?: (model: any) => void;

    // Text to show in Cancel Button. When empty button is hidden
    cancelButtonText?: string;
    cancelButtonIcon?: string;
    cancelButtonCallBack?: (model: any) => void;

    // Array of input details to build in output
    inputDetails?: InputDetail[];

    // Where to display our input values in dashboard etc
    inputLocation?: InputLocations;

    // Load the content of any files into the inputModel
    loadFileContent?: boolean;

    // Custom Button
    customButtonText?: string;
    customButtonIcon?: string;
    customButtonCallBack?: (model: any) => void;

    width?: string;
    height?: string;
}
