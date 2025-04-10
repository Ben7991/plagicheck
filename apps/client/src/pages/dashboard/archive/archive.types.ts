import { AlertProps } from '@components/molecules/alert/alert.util';

export type ArchiveUploaderProps = {
  onSetAlertInfo: (value: Omit<AlertProps, 'onHide'>) => void;
  onShowAlert: VoidFunction;
};
