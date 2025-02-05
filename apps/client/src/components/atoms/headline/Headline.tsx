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
    case 'h4':
      return (
        <h4 className={`font-semibold ${className} text-[1.2em]`}>
          {children}
        </h4>
      );
  }
}
