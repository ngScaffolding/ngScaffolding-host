import { InputDetail } from './inputDetail.model';
export const enum OrientationValues {
  Vertical = 'vertical',
  Horizontal = 'horizontal'
}
export class InputBuilderDefinition {
  // Arrange Controls
  orientation?: string;

  // Width in Columns of each control group in horizontal mode
  horizontalColumnCount?: number;

  // Text to show in OK Button. When empty button is hidden
  okButtonText?: string;
  okButtonIcon?: string;

  // Text to show in Cancel Button. When empty button is hidden
  cancelButtonText?: string;
  cancelButtonIcon?: string;

  // Array of input details to build in output
  inputDetails?: InputDetail[];

  // Custom Button
  customButtonText?: string;
  customButtonIcon?: string;
  customButtonCallBack?: { (): void };
}
