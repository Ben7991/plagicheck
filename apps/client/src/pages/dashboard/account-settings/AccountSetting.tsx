import { Link, useSearchParams } from 'react-router-dom';

import styles from './AccountSetting.module.css';
import PageHeader from '../../../components/organisms/page-header/PageHeader';
import UserIcon from '../../../components/atoms/icons/UserIcon';
import PasswordIcon from '../../../components/atoms/icons/PasswordIcon';
import ErrorBoundary from '../../error/error-boundary/ErrorBoundary';
import TrashIcon from '../../../components/atoms/icons/TrashIcon';
import {
  ChangePassword,
  PersonalInformation,
} from './account-settings.partials';
import Modal from '../../../components/organisms/modal/Modal';
import FormFooter from '../../../components/atoms/form-elements/form-footer/FormFooter';
import Button from '../../../components/atoms/button/Button';
import { useState } from 'react';

export default function AccountSettings() {
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab');

  if (activeTab === null) {
    return (
      <ErrorBoundary
        message="Current tab is unknown, click on the button below to reset. Thank you!!!"
        path="/dashboard/account-settings?tab=personal"
        fullScreen={false}
      />
    );
  }

  if (!['personal', 'password'].includes(activeTab)) {
    return (
      <ErrorBoundary
        message="Current tab is unknown, click on the button below to reset. Thank you!!!"
        path="/dashboard/account-settings?tab=personal"
        fullScreen={false}
      />
    );
  }

  return (
    <>
      <PageHeader />
      <section className="w-full lg:flex h-[91vh] mt-18 lg:mt-0">
        <aside className="p-5 lg:border-r lg:border-r-[var(--gray-700)] lg:basis-[230px] xl:basis-[250px] xl:py-7 xl:px-6">
          <ul className="flex gap-2 items-center md:justify-center lg:flex-col lg:justify-start lg:items-stretch lg:gap-6">
            <li>
              <Link
                to="/dashboard/account-settings?tab=personal"
                className={`py-3 px-4 rounded-lg flex gap-2 items-center ${activeTab === 'personal' && `${styles.acc} bg-[var(--sea-blue-400)] text-[var(--sea-blue-900)]`}`}
              >
                <UserIcon /> My Profile
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/account-settings?tab=password"
                className={`py-3 px-4 rounded-lg flex gap-2 items-center ${activeTab === 'password' && `${styles.acc} bg-[var(--sea-blue-400)] text-[var(--sea-blue-900)]`}`}
              >
                <PasswordIcon /> Password
              </Link>
            </li>
            <li>
              <button
                className="py-3 px-4 rounded-lg w-full flex gap-2 items-center cursor-pointer text-[var(--error-100)] hover:bg-[var(--gray-1000)]"
                onClick={() => setShowModal(true)}
              >
                <TrashIcon /> {window.innerWidth > 768 && 'Delete Account'}
              </button>
            </li>
          </ul>
        </aside>
        <section className="lg:basis-[calc(100%-200px)] 2xl:basis-[70%] p-5 xl:py-7 xl:px-6">
          {activeTab === 'personal' ? (
            <div className="w-full md:mx-auto md:w-[90%] xl:w-90%] lg:mx-0 2xl:w-[80%] xl:ms-10">
              <PersonalInformation />
            </div>
          ) : (
            <div className="w-full mx-auto md:w-[60%] lg:w-[70%] xl:w-[60%] 2xl:w-[50%] xl:ms-28">
              <ChangePassword />
            </div>
          )}
        </section>
      </section>

      {showModal && (
        <Modal onHide={() => setShowModal(false)} title="Logout">
          <p className="mb-4">
            Please not that deleting your account is an irreversible action.
            Take a moment to consider the consequences before proceeding with
            your decision.
          </p>
          <form>
            <FormFooter className="gap-[19px]">
              <Button
                el="button"
                variant="secondary"
                type="button"
                className="basis-[197px]"
                onClick={() => setShowModal(false)}
              >
                No keep
              </Button>
              <Button
                el="button"
                variant="danger"
                type="submit"
                className="basis-[197px]"
              >
                Yes, delete
              </Button>
            </FormFooter>
          </form>
        </Modal>
      )}
    </>
  );
}
