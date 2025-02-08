import { useState } from 'react';
import { AlertProps } from '../../../components/molecules/alert/alert.util';

export function useAlert() {
  const [alertState, setAlertState] = useState(false);
  const [alertInfo, setAlertInfo] = useState<Omit<AlertProps, 'onHide'>>();

  const hideAlert = () => {
    setAlertState(false);
  };

  const showAlert = () => {
    setAlertState(true);
  };

  return {
    alertState,
    alertInfo,
    hideAlert,
    showAlert,
    setAlertInfo,
  };
}
