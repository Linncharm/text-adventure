import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { supabase } from '@/lib';

export const getAuthToken = () => {
  return getCookie('token');
};

export const getRefreshToken = () => {
  return getCookie('refresh_token');
};

export const clearAuthTokens = () => {
  deleteCookie('token');
  deleteCookie('refresh_token');
};

export const refreshAuthToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearAuthTokens();
    return null;
  }

  try {
    const { data: { session }, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken as string,
    });

    if (error || !session) {
      clearAuthTokens();
      return null;
    }

    setCookie('token', session.access_token, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    setCookie('refresh_token', session.refresh_token, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return session;
  } catch (error) {
    clearAuthTokens();
    return null;
  }
};
