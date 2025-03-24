export function getAuthHeaders(token: string) {
  const authHeaders = new Headers();
  authHeaders.append('authorization', `Bearer ${token}`);
  authHeaders.append('Content-Type', 'application/json');
  return authHeaders;
}
