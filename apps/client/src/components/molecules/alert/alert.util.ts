import { AlertVariant } from '../../../util/enum/alert-variant.enum';

export type AlertProps = {
  message: string;
  variant: AlertVariant;
  onHide: VoidFunction;
};
