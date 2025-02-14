import { ReactNode, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthenticatedStatus } from './login.util';
import { useAppDispatch } from '../../../store/store.util';
import { getRememberMe, validateToken } from './login.util';
import { setAuthUser } from '../../../store/slice/auth/auth.slice';
import Loader from '../../../components/atoms/loader/Loader';

type CheckRememberMeProps = {
  children: ReactNode;
};

export default function CheckRememberMe({ children }: CheckRememberMeProps) {
  const dispatch = useAppDispatch();
  const [authStatus, setAuthStatus] = useState<AuthenticatedStatus>(
    AuthenticatedStatus.STALE,
  );

  useEffect(() => {
    const checkAuthentication = async () => {
      const hasRememberStatus = !!getRememberMe();

      if (!hasRememberStatus) {
        setTimeout(() => {
          setAuthStatus(AuthenticatedStatus.NOT_YET);
        }, 2000);
        return;
      }

      try {
        const result = await validateToken();
        dispatch(setAuthUser(result.data));
        setTimeout(() => {
          setAuthStatus(AuthenticatedStatus.AUTHENTICATED);
        }, 2000);
      } catch {
        setTimeout(() => {
          setAuthStatus(AuthenticatedStatus.NOT_YET);
        }, 2000);
      }
    };

    checkAuthentication();
  }, [dispatch]);

  if (authStatus === AuthenticatedStatus.AUTHENTICATED) {
    return <Navigate to="/dashboard" replace={true} />;
  } else if (authStatus === AuthenticatedStatus.NOT_YET) {
    return children;
  }

  return <Loader />;
}
