export function getToken(): string {
  const authCookie = document.cookie.split(';')[0];
  return authCookie ? authCookie.split('=')[1] : '';
}
