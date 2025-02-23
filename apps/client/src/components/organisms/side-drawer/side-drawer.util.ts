export type NavLinkClassNameProps = {
  isActive: boolean;
  isPending: boolean;
};

export type SideDrawerProps = {
  show: boolean;
  onHide: VoidFunction;
};

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
