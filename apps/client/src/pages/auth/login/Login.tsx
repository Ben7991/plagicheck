import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { schema, setRememberMe, signIn } from './login.util';
import { Inputs } from './login.util';
import { AlertVariant } from '../../../util/enum/alert-variant.enum';
import { useAlert } from '../../../util/hooks/use-alert/useAlert';
import { useAppDispatch } from '../../../store/store.util';
import { setAuthUser } from '../../../store/slice/auth/auth.slice';
import FormControl from '../../../components/atoms/form-elements/form-control/FormControl';
import FormGroup from '../../../components/atoms/form-elements/form-group/FormGroup';
import Label from '../../../components/atoms/form-elements/label/Label';
import EmailIcon from '../../../components/atoms/icons/EmailIcon';
import PasswordIcon from '../../../components/atoms/icons/PasswordIcon';
import AuthDescriptor from '../../../components/molecules/auth-descriptor/AuthDescriptor';
import FormFooter from '../../../components/atoms/form-elements/form-footer/FormFooter';
import Button from '../../../components/atoms/button/Button';
import PasswordToggler from '../../../components/molecules/password-toggler/PasswordToggler';
import FormControlError from '../../../components/atoms/form-elements/form-control-error/FormControlError';
import Alert from '../../../components/molecules/alert/Alert';

export default function Login(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { alertState, alertInfo, hideAlert, setAlertInfo, showAlert } =
    useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);

    try {
      const result = await signIn(data);
      dispatch(setAuthUser(result.data));
      reset();

      if (data.rememberMe) {
        setRememberMe();
      }

      navigate('/dashboard');
    } catch (error) {
      const message = (error as Error).message;
      console.error(message);
      setAlertInfo({ message, variant: AlertVariant.ERROR });
      showAlert();
    }

    setIsLoading(false);
  };

  return (
    <>
      {alertState && alertInfo && (
        <Alert
          message={alertInfo.message}
          variant={alertInfo.variant}
          onHide={hideAlert}
        />
      )}
      <AuthDescriptor
        title="Login"
        info="Please enter your login details below to access your account"
      />
      <form onSubmit={handleSubmit(onSubmit)} role="form">
        <FormGroup className="mb-4">
          <Label htmlFor="username">Email / ID</Label>
          <FormControl
            leftIcon={<EmailIcon />}
            type="text"
            placeholder="Your email or id"
            id="username"
            {...register('username')}
            hasError={!!errors.username}
          />
          {errors.username && (
            <FormControlError message={errors.username.message} />
          )}
        </FormGroup>
        <FormGroup className="mb-4">
          <Label htmlFor="password">Password</Label>
          <FormControl
            leftIcon={<PasswordIcon />}
            type={showPassword ? 'text' : 'password'}
            placeholder="Type your password here"
            id="password"
            {...register('password')}
            hasError={!!errors.password}
            rightIcon={
              <PasswordToggler
                state={showPassword}
                toggle={() => setShowPassword(!showPassword)}
              />
            }
          />
          {errors.password && (
            <FormControlError message={errors.password.message} />
          )}
        </FormGroup>
        <div className="flex justify-between mb-4">
          <label className="flex gap-2 items-center select-none">
            <input
              type="checkbox"
              className="w-[16px] h-[16px]"
              {...register('rememberMe')}
            />{' '}
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-[var(--sea-blue-100)] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <FormFooter className="flex-col">
          <Button
            el="button"
            variant="primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </Button>
        </FormFooter>
      </form>
    </>
  );
}
