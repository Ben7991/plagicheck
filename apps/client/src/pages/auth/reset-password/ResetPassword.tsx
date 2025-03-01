import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Inputs, resetPassword, schema } from './reset-password.util';
import { useAlert } from '../../../util/hooks/use-alert/useAlert';
import { AlertVariant } from '../../../util/enum/alert-variant.enum';
import FormControl from '../../../components/atoms/form-elements/form-control/FormControl';
import FormGroup from '../../../components/atoms/form-elements/form-group/FormGroup';
import Label from '../../../components/atoms/form-elements/label/Label';
import PasswordIcon from '../../../components/atoms/icons/PasswordIcon';
import AuthDescriptor from '../../../components/molecules/auth-descriptor/AuthDescriptor';
import FormFooter from '../../../components/atoms/form-elements/form-footer/FormFooter';
import Button from '../../../components/atoms/button/Button';
import PasswordToggler from '../../../components/molecules/password-toggler/PasswordToggler';
import FormControlError from '../../../components/atoms/form-elements/form-control-error/FormControlError';
import Alert from '../../../components/molecules/alert/Alert';

export default function ResetPassword(): JSX.Element {
  const timerRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { alertInfo, alertState, hideAlert, setAlertInfo, showAlert } =
    useAlert();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    const token = searchParams.get('token')!;

    try {
      const result = await resetPassword(data, token);
      reset();
      setAlertInfo({
        message: result.message,
        variant: AlertVariant.SUCCESS,
      });

      timerRef.current = setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setAlertInfo({
        message: (error as Error).message,
        variant: AlertVariant.ERROR,
      });
      setIsLoading(false);
    }

    showAlert();
  };

  return (
    <>
      {alertState && alertInfo && (
        <Alert
          message={alertInfo.message}
          onHide={hideAlert}
          variant={alertInfo.variant}
        />
      )}
      <AuthDescriptor
        title="Reset Password"
        info="Please enter your new password to reset. Upon success, head to the login page to sign-in"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup className="mb-4">
          <Label htmlFor="newPassword">New Password</Label>
          <FormControl
            leftIcon={<PasswordIcon />}
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Type your password here"
            {...register('newPassword')}
            hasError={!!errors.newPassword}
            id="newPassword"
            rightIcon={
              <PasswordToggler
                state={showNewPassword}
                toggle={() => setShowNewPassword(!showNewPassword)}
              />
            }
          />
          {errors.newPassword && (
            <FormControlError message={errors.newPassword.message} />
          )}
        </FormGroup>
        <FormGroup className="mb-4">
          <Label htmlFor="confirmPassword">Password</Label>
          <FormControl
            leftIcon={<PasswordIcon />}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            {...register('confirmPassword')}
            hasError={!!errors.confirmPassword}
            id="confirmPassword"
            rightIcon={
              <PasswordToggler
                state={showConfirmPassword}
                toggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
          {errors.confirmPassword && (
            <FormControlError message={errors.confirmPassword.message} />
          )}
        </FormGroup>
        <FormFooter className="flex-col gap-4">
          <Button
            el="button"
            variant="primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Save new password'}
          </Button>
        </FormFooter>
      </form>
    </>
  );
}
