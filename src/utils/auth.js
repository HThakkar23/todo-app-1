export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getUserFromToken = async () => {
  const token = getToken();
  if (!token) return null;
  try {
    const jwtDecode = await import('jwt-decode');
    return jwtDecode.default(token);
  } catch (error) {
    console.error('Invalid token');
    return null;
  }
};
