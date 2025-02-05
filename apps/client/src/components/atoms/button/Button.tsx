import type { ComponentPropsWithoutRef } from 'react';
import { Link } from 'react-router-dom';

type AnchorProps = {
  el: 'link';
  variant: 'primary' | 'danger' | 'secondary';
} & ComponentPropsWithoutRef<'a'>;

type ButtonProps = {
  el: 'button';
  variant: 'primary' | 'danger' | 'secondary';
} & ComponentPropsWithoutRef<'button'>;

export default function Button(props: ButtonProps | AnchorProps): JSX.Element {
  let variantStyle = '';

  switch (props.variant) {
    case 'primary':
      variantStyle =
        'py-3 bg-[var(--sea-blue-100)] text-white hover:bg-[var(--sea-blue-900)] active:bg-[var(--sea-blue-500)]';
      break;
    case 'danger':
      variantStyle =
        'py-3 bg-[var(--error-100)] text-white hover:bg-[var(--error-900)] active:bg-[var(--error-500)]';
      break;
    case 'secondary':
      variantStyle =
        'py-[10px] border border-[var(--gray-700)] bg-[var(--gray-100)] text-[var(--black-300)] hover:bg-[var(--gray-1000)] active:bg-[var(--gray-900)]';
      break;
  }

  if (props.el === 'link') {
    const { className, ...remainingProps } = props;
    return (
      <Link
        to={props.href!}
        {...remainingProps}
        className={`rounded-lg ${className} ${variantStyle} disabled:opacity-20`}
      >
        {props.children}
      </Link>
    );
  }

  const { className, ...remainingProps } = props;

  return (
    <button
      {...remainingProps}
      className={`rounded-lg cursor-pointer ${className} ${variantStyle} disabled:opacity-20 disabled:cursor-not-allowed`}
    >
      {props.children}
    </button>
  );
}
