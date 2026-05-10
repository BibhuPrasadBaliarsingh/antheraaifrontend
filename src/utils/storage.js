const AUTH_TOKEN_KEY = 'team-task-token';
const AUTH_USER_KEY = 'team-task-user';

export const saveAuthData = (token, user) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const getUser = () => {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const removeAuthData = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};
