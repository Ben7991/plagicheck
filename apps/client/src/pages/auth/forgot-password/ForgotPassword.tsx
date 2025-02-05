import Button from '../../../components/atoms/button/Button';
import FormControl from '../../../components/atoms/form-elements/form-control/FormControl';
import FormFooter from '../../../components/atoms/form-elements/form-footer/FormFooter';
import FormGroup from '../../../components/atoms/form-elements/form-group/FormGroup';
import Label from '../../../components/atoms/form-elements/label/Label';
import EmailIcon from '../../../components/atoms/icons/EmailIcon';
import LeftArrowIcon from '../../../components/atoms/icons/LeftArrowIcon';
import AuthDescriptor from '../../../components/molecules/auth-descriptor/AuthDescriptor';

export default function ForgotPassword(): JSX.Element {
  return (
    <>
      <AuthDescriptor
        title="Forgot Password"
        info="Please enter your email to receive the reset link in your mail."
      />
      <form>
        <FormGroup className="mb-4">
          <Label>Email</Label>
          <FormControl
            leftIcon={<EmailIcon />}
            type="text"
            placeholder="Your email"
          />
        </FormGroup>
        <FormFooter className="flex-col gap-4">
          <Button el="button" variant="primary" type="button">
            Send reset link
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
