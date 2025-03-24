import { ReactNode } from 'react';

type HeadlineProps = {
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  children: ReactNode;
};

export default function Headline({
  type,
  className,
  children,
}: HeadlineProps): JSX.Element | undefined {
  switch (type) {
    case 'h2':
      return (
        <h2 className={`font-semibold ${className} text-[1.73em]`}>
          {children}
        </h2>
      );
    case 'h3':
      return (
        <h3 className={`font-semibold ${className} text-2xl`}>{children}</h3>
      );
    case 'h4':
      return (
        <h4 className={`font-semibold ${className} text-[1.2em]`}>
          {children}
        </h4>
      );
    case 'h5':
      return <h5 className={`font-semibold ${className}`}>{children}</h5>;
  }
}
