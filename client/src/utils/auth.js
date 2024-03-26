export const checkSession = async () => {
  try {
    const response = await fetch('/api/session', {
      method: 'GET',
      credentials: 'include', // Necessary for cookies to be sent with the request
    });

    if (!response.ok) {
      throw new Error('Session validation failed');
    }

    const data = await response.json();
    return data; // Assuming this includes user information if authenticated
  } catch (error) {
    console.error(error);
    return null;
  }
};