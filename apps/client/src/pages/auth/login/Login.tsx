import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { schema } from './login.util';
import { Inputs } from './login.util';
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

export default function Login(): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <>
      <AuthDescriptor
        title="Login"
        info="Please enter your login details below to access your account"
      />
      <form onSubmit={handleSubmit(onSubmit)} role="login-form">
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
            <input type="checkbox" className="w-[16px] h-[16px]" /> Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-[var(--sea-blue-100)] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <FormFooter className="flex-col">
          <Button el="button" variant="primary" type="submit">
            Login
          </Button>
        </FormFooter>
      </form>
    </>
  );
}
