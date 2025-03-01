import { ReactNode, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { validateResetToken } from './reset-password.util';
import Loader from '../../../components/atoms/loader/Loader';
import ErrorBoundary from '../../error/error-boundary/ErrorBoundary';

type CheckResetTokenProps = {
  children: ReactNode;
};

export default function CheckResetToken({ children }: CheckResetTokenProps) {
  const timerRef = useRef<NodeJS.Timeout>();
  const [errorMessage, setErrorMessage] = useState('');
  const [tokenValidityStatus, setTokenValidityStatus] = useState<
    'pending' | 'in-valid' | 'success'
  >('pending');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        await validateResetToken(token);
        timerRef.current = setTimeout(() => {
          setTokenValidityStatus('success');
        }, 2000);
      } catch (error) {
        timerRef.current = setTimeout(() => {
          setTokenValidityStatus('in-valid');
        }, 2000);
        setErrorMessage((error as Error).message);
      }
    };

    checkTokenValidity();

    return () => clearTimeout(timerRef.current);
  }, [token]);

  if (tokenValidityStatus === 'success') {
    return children;
  } else if (tokenValidityStatus === 'in-valid') {
    return <ErrorBoundary message={errorMessage} path="/" />;
  }

  return <Loader />;
}
