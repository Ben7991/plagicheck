import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { schema, Inputs, requestPasswordReset } from './forgot-password.util';
import Button from '../../../components/atoms/button/Button';
import FormControl from '../../../components/atoms/form-elements/form-control/FormControl';
import FormFooter from '../../../components/atoms/form-elements/form-footer/FormFooter';
import FormGroup from '../../../components/atoms/form-elements/form-group/FormGroup';
import Label from '../../../components/atoms/form-elements/label/Label';
import EmailIcon from '../../../components/atoms/icons/EmailIcon';
import LeftArrowIcon from '../../../components/atoms/icons/LeftArrowIcon';
import AuthDescriptor from '../../../components/molecules/auth-descriptor/AuthDescriptor';
import FormControlError from '../../../components/atoms/form-elements/form-control-error/FormControlError';
import { useAlert } from '../../../util/hooks/use-alert/useAlert';
import { useRef, useState } from 'react';
import { AlertVariant } from '../../../util/enum/alert-variant.enum';
import Alert from '../../../components/molecules/alert/Alert';

export default function ForgotPassword(): JSX.Element {
  const timerRef = useRef<NodeJS.Timeout>();
  const [isLoading, setIsLoading] = useState(false);
  const { alertState, alertInfo, hideAlert, setAlertInfo, showAlert } =
    useAlert();
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
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsLoading(true);

    const result = await requestPasswordReset(data);
    setAlertInfo({
      message: result.message,
      variant: AlertVariant.SUCCESS,
    });

    timerRef.current = setTimeout(() => {
      showAlert();
      setIsLoading(false);
      reset();
    }, 2000);
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
        title="Forgot Password"
        info="Please enter your email to receive the reset link in your mail."
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup className="mb-4">
          <Label htmlFor="email">Email</Label>
          <FormControl
            leftIcon={<EmailIcon />}
            type="text"
            placeholder="Your email"
            hasError={!!errors.email}
            id="email"
            {...register('email')}
          />
          {errors.email && <FormControlError message={errors.email.message} />}
        </FormGroup>
        <FormFooter className="flex-col gap-4">
          <Button
            el="button"
            variant="primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Send reset link'}
          </Button>
          <Button
            el="link"
            variant="secondary"
            className="flex items-center justify-center gap-2"
            href="/"
          >
            <LeftArrowIcon /> Back to login
          </Button>
        </FormFooter>
      </form>
    </>
  );
}
