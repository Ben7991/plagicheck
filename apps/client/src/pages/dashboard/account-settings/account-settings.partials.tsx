import { useRef } from 'react';
import Button from '../../../components/atoms/button/Button';
import FormControl from '../../../components/atoms/form-elements/form-control/FormControl';
import FormFooter from '../../../components/atoms/form-elements/form-footer/FormFooter';
import FormGroup from '../../../components/atoms/form-elements/form-group/FormGroup';
import Label from '../../../components/atoms/form-elements/label/Label';
import Headline from '../../../components/atoms/headline/Headline';
import CameraIcon from '../../../components/atoms/icons/CameraIcon';
import UserIcon from '../../../components/atoms/icons/UserIcon';
// import profile from '../../../assets/profile.jpg';

type AccountSettingsHeaderProps = {
  title: string;
  description: string;
};

export function AccountSettingsHeader({
  title,
  description,
}: AccountSettingsHeaderProps) {
  return (
    <header className="space-y-2 border-b border-b-[var(--gray-700)] pb-4 mb-4 xl:mb-8">
      <Headline type="h4">{title}</Headline>
      <p className="text-gray-500">{description}</p>
    </header>
  );
}

export function PersonalInformation() {
  const fileUploadRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <AccountSettingsHeader
        title="Personal Information"
        description="Manipulate your personal info below"
      />
      <div className="flex gap-6 items-center my-5 lg:mb-10">
        <input type="file" hidden ref={fileUploadRef} accept="image/*" />
        <div className="w-[114px] h-[114px] rounded-full border border-[var(--gray-700)] flex items-center justify-center relative">
          <UserIcon width={40} height={40} />
          {/* <img
            src={profile}
            alt="User profile photo"
            className="w-[100px] h-[100px] rounded-full object-cover"
          /> */}
          <button
            className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#CCD3E0] border border-white cursor-pointer"
            type="button"
            onClick={() => fileUploadRef.current?.click()}
          >
            <CameraIcon />
          </button>
        </div>
        <div className="space-y-2">
          <Headline type="h4">Esther Howard</Headline>
          <p className="text-gray-500">Staff ID: 1234</p>
        </div>
      </div>
      <form>
        <div className="md:flex md:gap-4 lg:gap-14">
          <FormGroup className="mb-3 md:flex-grow md:mb-8">
            <Label htmlFor="firstName" className="inline-block mb-1">
              First name
            </Label>
            <FormControl
              type="text"
              id="firstName"
              placeholder="Enter first name here"
            />
          </FormGroup>
          <FormGroup className="mb-3 md:flex-grow md:mb-8">
            <Label htmlFor="lastName" className="inline-block mb-1">
              Last name
            </Label>
            <FormControl
              type="text"
              id="lastName"
              placeholder="Enter last name here"
            />
          </FormGroup>
        </div>
        <div className="md:flex md:gap-4 lg:gap-14">
          <FormGroup className="mb-3 md:flex-grow md:mb-8">
            <Label htmlFor="email" className="inline-block mb-1">
              Email address
            </Label>
            <FormControl
              type="text"
              id="email"
              placeholder="Eg. example23@gmail.com"
            />
          </FormGroup>
          <FormGroup className="mb-3 md:flex-grow md:mb-8">
            <Label htmlFor="lastName" className="inline-block mb-1">
              Phone
            </Label>
            <FormControl
              type="text"
              id="lastName"
              placeholder="(603) 555-0123"
            />
          </FormGroup>
        </div>
        <FormFooter className="gap-4 md:w-2/3 2xl:w-1/2">
          <Button
            el="button"
            variant="secondary"
            className="basis-[159px]"
            type="button"
          >
            Cancel
          </Button>
          <Button
            el="button"
            variant="primary"
            className="basis-[159px]"
            type="submit"
          >
            Save changes
          </Button>
        </FormFooter>
      </form>
    </>
  );
}

export function ChangePassword() {
  return (
    <>
      <AccountSettingsHeader
        title="Password"
        description="Please enter your current password to change your password"
      />
      <form>
        <FormGroup className="mb-3 xl:mb-8">
          <Label htmlFor="current_password" className="mb-1 inline-block">
            Current Password
          </Label>
          <FormControl
            type="password"
            id="current_password"
            placeholder="Enter your current password"
          />
        </FormGroup>
        <FormGroup className="mb-3 xl:mb-8">
          <Label htmlFor="new_password" className="mb-1 inline-block">
            New Password
          </Label>
          <FormControl
            type="password"
            id="new_password"
            placeholder="Enter your new password"
          />
          <small className="block text-gray-500 my-1">
            Must be alpha-numeric and must be more than 8 characters
          </small>
        </FormGroup>
        <FormGroup className="mb-14">
          <Label htmlFor="confirm_password" className="mb-1 inline-block">
            Confirm Password
          </Label>
          <FormControl
            type="password"
            id="confirm_password"
            placeholder="Confirm your new password"
          />
        </FormGroup>
        <FormFooter className="gap-4">
          <Button
            el="button"
            variant="secondary"
            className="basis-[159px]"
            type="button"
          >
            Cancel
          </Button>
          <Button
            el="button"
            variant="primary"
            className="basis-[159px]"
            type="submit"
          >
            Save changes
          </Button>
        </FormFooter>
      </form>
    </>
  );
}
