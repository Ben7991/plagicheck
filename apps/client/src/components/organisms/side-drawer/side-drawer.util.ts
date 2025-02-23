export type NavLinkClassNameProps = {
  isActive: boolean;
  isPending: boolean;
};

export type SideDrawerProps = {
  show: boolean;
  onHide: VoidFunction;
};

export function navLinkClass({ isActive, isPending }: NavLinkClassNameProps) {
  const className = 'flex items-center gap-2 py-2 px-4 rounded-lg';

  if (isActive) {
    return `${className} bg-[var(--sea-blue-100)] text-white nav-link-active`;
  } else if (isPending) {
    return `${className} hover:bg-[var(--gray-100)]`;
  } else {
    return `${className} hover:bg-[var(--gray-100)]`;
  }
}

export function dropDownItemClass({
  isActive,
  isPending,
}: NavLinkClassNameProps) {
  const className =
    'flex items-center gap-2 py-1 px-4 rounded-lg text-[0.875em]';

  if (isActive) {
    return `${className} bg-[var(--sea-blue-100)] text-white nav-link-active`;
  } else if (isPending) {
    return `${className} hover:bg-[var(--gray-100)]`;
  } else {
    return `${className} hover:bg-[var(--gray-100)]`;
  }
}

export async function logout() {
  const response = await fetch('http://localhost:3000/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  await response.json();

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return;
}
