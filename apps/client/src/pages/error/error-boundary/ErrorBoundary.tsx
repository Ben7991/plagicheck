import AppLogo from '../../../components/molecules/app-logo/AppLogo';
import Headline from '../../../components/atoms/headline/Headline';
import Button from '../../../components/atoms/button/Button';
import LeftArrowIcon from '../../../components/atoms/icons/LeftArrowIcon';

type ErrorBoundaryProps = {
  message: string;
  path?: string;
};

export default function ErrorBoundary({ message, path }: ErrorBoundaryProps) {
  return (
    <main className="w-full h-screen bg-[var(--gray-100)] fixed top-0 left-0 flex items-center justify-center">
      <section className="text-center space-y-4">
        <AppLogo />
        <Headline type="h3">Oops!!!</Headline>
        <p>{message}</p>
        {path && (
          <div>
            <Button
              el="link"
              variant="secondary"
              className="flex items-center justify-center gap-2"
              href="/"
            >
              <LeftArrowIcon /> Back to login
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
