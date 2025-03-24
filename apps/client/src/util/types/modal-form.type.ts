import { AlertProps } from '@components/molecules/alert/alert.util';

export type ModalFormProps = {
  currentAction: 'add' | 'edit' | 'delete';
  onCancel: VoidFunction;
  onSetAlertInfo: (value: Omit<AlertProps, 'onHide'>) => void;
  onShowAlert: VoidFunction;
};
