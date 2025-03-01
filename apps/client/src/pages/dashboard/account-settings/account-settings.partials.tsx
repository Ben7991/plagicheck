import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  AlertInfoProps,
  changeImage,
  changePassword,
  changePersonalInformation,
  isImage,
  PasswordInputs,
  passwordSchema,
  PersonalInfoInputs,
  personalInfoSchema,
} from './account-settings.util';
import { useAppDispatch, useAppSelector } from '../../../store/store.util';
import {
  changeEmailandName,
  changeImagePath,
  logoutAuthUser,
} from '../../../store/slice/auth/auth.slice';
import Button from '../../../components/atoms/button/Button';
import FormControl from '../../../components/atoms/form-elements/form-control/FormControl';
import FormFooter from '../../../components/atoms/form-elements/form-footer/FormFooter';
import FormGroup from '../../../components/atoms/form-elements/form-group/FormGroup';
import Label from '../../../components/atoms/form-elements/label/Label';
import Headline from '../../../components/atoms/headline/Headline';
import CameraIcon from '../../../components/atoms/icons/CameraIcon';
import UserIcon from '../../../components/atoms/icons/UserIcon';
import FormControlError from '../../../components/atoms/form-elements/form-control-error/FormControlError';
import { AlertVariant } from '../../../util/enum/alert-variant.enum';
import { clearRememberMe } from '../../auth/login/login.util';
import { logout } from '../../../components/organisms/side-drawer/side-drawer.util';
import Spinner from '../../../components/atoms/spinner/Spinner';

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

function PersonalInformationProfile({
  onSetAlertInfo,
  onShowAlert,
}: AlertInfoProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAppSelector((state) => state.auth.data);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    if (!isImage(file)) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const formData = new FormData();
      formData.append('image', file);

      setIsLoading(true);
      await sendImage(formData);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const sendImage = useCallback(
    async (formData: FormData) => {
      try {
        const result = await changeImage(formData);
        dispatch(changeImagePath(result.data.path));
        onShowAlert();
        onSetAlertInfo({
          message: result.message,
          variant: AlertVariant.SUCCESS,
        });
      } catch (error) {
        onShowAlert();
        onSetAlertInfo({
          message: 'Something went wrong',
          variant: AlertVariant.ERROR,
        });
      }
    },
    [dispatch, onSetAlertInfo, onShowAlert],
  );

  return (
    <div className="flex gap-6 items-center my-5 lg:mb-10">
      <input
        type="file"
        hidden
        ref={fileUploadRef}
        accept="image/*"
        onChange={handleInputChange}
      />
      <div
        className={`w-[114px] h-[114px] rounded-full ${!authUser?.imagePath && 'border border-[var(--gray-700)]'} flex items-center justify-center relative`}
      >
        {authUser?.imagePath ? (
          <img
            src={`http://localhost:3000/${authUser?.imagePath}`}
            alt="User profile photo"
            className="w-[114px] h-[114px] rounded-full object-cover shadow-lg border border-[var(--gray-700)]"
          />
        ) : (
          <UserIcon width={40} height={40} />
        )}
        <button
          className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#CCD3E0] border border-white cursor-pointer"
          type="button"
          onClick={() => fileUploadRef.current?.click()}
        >
          <CameraIcon />
        </button>
      </div>
      <div className="space-y-2 mr-3 md:mr-5 lg:mr-10">
        <Headline type="h4">{authUser?.name}</Headline>
        <p className="text-gray-500">Staff ID: {authUser?.id}</p>
      </div>
      {isLoading && <Spinner />}
    </div>
  );
}

export function PersonalInformation({
  onSetAlertInfo,
  onShowAlert,
}: AlertInfoProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PersonalInfoInputs>({
    resolver: yupResolver(personalInfoSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<PersonalInfoInputs> = async (data) => {
    setIsLoading(true);

    try {
      const result = await changePersonalInformation(data);
      dispatch(
        changeEmailandName({
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
        }),
      );
      onSetAlertInfo({
        message: result.message,
        variant: AlertVariant.SUCCESS,
      });
      reset();
    } catch (error) {
      if ((error as Error).message === 'UN_AUTHORIZED') {
        onSetAlertInfo({
          message: 'Your session has expired',
          variant: AlertVariant.ERROR,
        });

        setTimeout(() => {
          navigate('/');
        }, 2000);
        return;
      }

      onSetAlertInfo({
        message: (error as Error).message,
        variant: AlertVariant.ERROR,
      });
    }

    setIsLoading(false);
    onShowAlert();
  };

  return (
    <>
      <AccountSettingsHeader
        title="Personal Information"
        description="Manipulate your personal info below"
      />
      <PersonalInformationProfile
        onSetAlertInfo={onSetAlertInfo}
        onShowAlert={onShowAlert}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="md:flex md:gap-4 lg:gap-14">
          <FormGroup className="mb-3 md:flex-grow md:mb-8">
            <Label htmlFor="firstName" className="inline-block mb-1">
              First name
            </Label>
            <FormControl
              type="text"
              id="firstName"
              placeholder="Enter first name here"
              hasError={!!errors.firstName}
              {...register('firstName')}
            />
            {errors.firstName && (
              <FormControlError message={errors.firstName.message} />
            )}
          </FormGroup>
          <FormGroup className="mb-3 md:flex-grow md:mb-8">
            <Label htmlFor="lastName" className="inline-block mb-1">
              Last name
            </Label>
            <FormControl
              type="text"
              id="lastName"
              placeholder="Enter last name here"
              hasError={!!errors.lastName}
              {...register('lastName')}
            />
            {errors.lastName && (
              <FormControlError message={errors.lastName.message} />
            )}
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
              hasError={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <FormControlError message={errors.email.message} />
            )}
          </FormGroup>
          <FormGroup className="mb-3 md:flex-grow md:mb-8">
            <Label htmlFor="phone" className="inline-block mb-1">
              Phone
            </Label>
            <FormControl
              type="text"
              id="phone"
              placeholder="(603) 555-0123"
              hasError={!!errors.phone}
              {...register('phone')}
            />
            {errors.phone && (
              <FormControlError message={errors.phone.message} />
            )}
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
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Save changes'}
          </Button>
        </FormFooter>
      </form>
    </>
  );
}

export function ChangePassword({
  onSetAlertInfo,
  onShowAlert,
}: AlertInfoProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordInputs>({
    resolver: yupResolver(passwordSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<PasswordInputs> = async (data) => {
    setIsLoading(true);

    try {
      const result = await changePassword(data);
      onSetAlertInfo({
        message: result.message,
        variant: AlertVariant.SUCCESS,
      });
      reset();
      dispatch(logoutAuthUser());
      clearRememberMe();
      await logout();
      navigate('/');
    } catch (error) {
      onSetAlertInfo({
        message: (error as Error).message,
        variant: AlertVariant.ERROR,
      });
      setIsLoading(false);
      onShowAlert();
    }
  };

  return (
    <>
      <AccountSettingsHeader
        title="Password"
        description="Please enter your current password to change your password"
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup className="mb-3 xl:mb-8">
          <Label htmlFor="current_password" className="mb-1 inline-block">
            Current Password
          </Label>
          <FormControl
            type="password"
            id="current_password"
            placeholder="Enter your current password"
            {...register('currentPassword')}
            hasError={!!errors.currentPassword}
          />
          {errors.currentPassword && (
            <FormControlError message={errors.currentPassword.message} />
          )}
        </FormGroup>
        <FormGroup className="mb-3 xl:mb-8">
          <Label htmlFor="new_password" className="mb-1 inline-block">
            New Password
          </Label>
          <FormControl
            type="password"
            id="new_password"
            placeholder="Enter your new password"
            {...register('newPassword')}
            hasError={!!errors.newPassword}
          />
          <small className="block text-gray-500 my-1">
            First letter must be uppercase, alpha-numeric, contain symbol(s) and
            must be more than 8 characters
          </small>
          {errors.newPassword && (
            <FormControlError message={errors.newPassword.message} />
          )}
        </FormGroup>
        <FormGroup className="mb-14">
          <Label htmlFor="confirm_password" className="mb-1 inline-block">
            Confirm Password
          </Label>
          <FormControl
            type="password"
            id="confirm_password"
            placeholder="Confirm your new password"
            {...register('confirmPassword')}
            hasError={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <FormControlError message={errors.confirmPassword.message} />
          )}
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
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Save changes'}
          </Button>
        </FormFooter>
      </form>
    </>
  );
}
