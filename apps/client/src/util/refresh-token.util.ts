export async function refreshAccessToken() {
  const response = await fetch('http://localhost:3000/api/auth/refresh-token', {
    credentials: 'include',
  });

  if (!response.ok) {
    return false;
  }

  return true;
}
