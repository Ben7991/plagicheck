import { useState } from 'react';

import FormControl from '../../../components/atoms/form-elements/form-control/FormControl';
import FormGroup from '../../../components/atoms/form-elements/form-group/FormGroup';
import Label from '../../../components/atoms/form-elements/label/Label';
import PasswordIcon from '../../../components/atoms/icons/PasswordIcon';
import AuthDescriptor from '../../../components/molecules/auth-descriptor/AuthDescriptor';
import FormFooter from '../../../components/atoms/form-elements/form-footer/FormFooter';
import Button from '../../../components/atoms/button/Button';
import PasswordToggler from '../../../components/molecules/password-toggler/PasswordToggler';
import LeftArrowIcon from '../../../components/atoms/icons/LeftArrowIcon';

export default function ResetPassword(): JSX.Element {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <AuthDescriptor
        title="Reset Password"
        info="Please enter your new password to reset. Upon success, head to the login page to sign-in"
      />
      <form>
        <FormGroup className="mb-4">
          <Label>Password</Label>
          <FormControl
            leftIcon={<PasswordIcon />}
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Type your password here"
            rightIcon={
              <PasswordToggler
                state={showNewPassword}
                toggle={() => setShowNewPassword(!showNewPassword)}
              />
            }
          />
        </FormGroup>
        <FormGroup className="mb-4">
          <Label>Password</Label>
          <FormControl
            leftIcon={<PasswordIcon />}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            rightIcon={
              <PasswordToggler
                state={showConfirmPassword}
                toggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
        </FormGroup>
        <FormFooter className="flex-col gap-4">
          <Button el="button" variant="primary" type="button">
            Save new password
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
