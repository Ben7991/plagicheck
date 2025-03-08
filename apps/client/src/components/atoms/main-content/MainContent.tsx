import { ReactNode } from 'react';

type MainContentProps = {
  children: ReactNode;
};

export default function MainContent({ children }: MainContentProps) {
  return (
    <section className="py-3 px-4 md:py-4 md:px-5 xl:py-[25px] xl:px-[41px]">
      {children}
    </section>
  );
}
