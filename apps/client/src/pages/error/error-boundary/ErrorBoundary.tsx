import AppLogo from '../../../components/molecules/app-logo/AppLogo';
import Headline from '../../../components/atoms/headline/Headline';
import Button from '../../../components/atoms/button/Button';
import LeftArrowIcon from '../../../components/atoms/icons/LeftArrowIcon';

type ErrorBoundaryProps = {
  message: string;
  path?: string;
  fullScreen?: boolean;
};

export default function ErrorBoundary({
  message,
  path,
  fullScreen = true,
}: ErrorBoundaryProps) {
  return (
    <main
      className={`w-full h-screen bg-[var(--gray-100)] ${fullScreen && 'fixed top-0 left-0'} flex items-center justify-center`}
    >
      <section className="text-center space-y-4">
        <AppLogo className="flex justify-center" />
        <Headline type="h3">Oops!!!</Headline>
        <p>{message}</p>
        <div className="mx-auto w-48">
          <Button
            el="link"
            variant="secondary"
            className="flex items-center justify-center gap-2"
            href={path}
          >
            <LeftArrowIcon /> Go Back
          </Button>
        </div>
      </section>
    </main>
  );
}
