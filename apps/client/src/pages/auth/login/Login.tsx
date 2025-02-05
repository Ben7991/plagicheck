import { useState } from 'react';
import { Link } from 'react-router-dom';

import FormControl from '../../../components/atoms/form-elements/form-control/FormControl';
import FormGroup from '../../../components/atoms/form-elements/form-group/FormGroup';
import Label from '../../../components/atoms/form-elements/label/Label';
import EmailIcon from '../../../components/atoms/icons/EmailIcon';
import PasswordIcon from '../../../components/atoms/icons/PasswordIcon';
import AuthDescriptor from '../../../components/molecules/auth-descriptor/AuthDescriptor';
import FormFooter from '../../../components/atoms/form-elements/form-footer/FormFooter';
import Button from '../../../components/atoms/button/Button';
import PasswordToggler from '../../../components/molecules/password-toggler/PasswordToggler';

export default function Login(): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <AuthDescriptor
        title="Login"
        info="Please enter your login details below to access your account"
      />
      <form>
        <FormGroup className="mb-4">
          <Label>Email/Staff ID</Label>
          <FormControl
            leftIcon={<EmailIcon />}
            type="text"
            placeholder="Your email or id"
          />
        </FormGroup>
        <FormGroup className="mb-4">
          <Label>Password</Label>
          <FormControl
            leftIcon={<PasswordIcon />}
            type={showPassword ? 'text' : 'password'}
            placeholder="Type your password here"
            rightIcon={
              <PasswordToggler
                state={showPassword}
                toggle={() => setShowPassword(!showPassword)}
              />
            }
          />
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
          <Button el="button" variant="primary" type="button">
            Login
          </Button>
        </FormFooter>
      </form>
    </>
  );
}
