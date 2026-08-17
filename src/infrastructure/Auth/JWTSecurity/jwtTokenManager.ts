/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const BR3_API_URL = window.BR3_API_URL;

// Helper function to check if the token is expired
const isTokenExpired = (token: string): boolean => {
  const decodedToken: any = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};

// Function to refresh token
// const refreshToken = async (): Promise<string> => {
//   const refreshedToken = localStorage.getItem('refreshToken');
//   // if (!refreshedToken) throw new Error('No refresh token available');

//   const response = await fetch(`${API_BASE_URL}/api/refresh-token`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ refreshedToken }),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to refresh token');
//   }

//   const data = await response.json();
//   localStorage.setItem('jwt', data.token);
//   localStorage.setItem('refreshToken', data.refreshToken);
//   return data.token;
// };

// Function to get the token, refresh if needed
export const getToken = async (): Promise<string | null> => {
  // 1. detect current path
  const currentPath = window.location.pathname;

  // 2. routes where we should NOT redirect even if token is missing/expired
  const authRoutes = ['/loginUsername', '/loginPassword'];

  let userInfo: any;
  const jsonUserInfo = localStorage.getItem('userInfo');
  if (jsonUserInfo) {
    userInfo = JSON.parse(jsonUserInfo);
  }

  const token = userInfo?.userToken || '';

  // helper: redirect only if not already on login
  const redirectToLogin = () => {
    if (!authRoutes.includes(currentPath)) {
      // clear stuff
      localStorage.removeItem('userInfo');
      // localStorage.removeItem('refreshToken');
      window.location.replace(`${window.location.origin}/loginUsername`);
    }
  };

  if (token && isTokenExpired(token)) {
    toast.error('Token expired Rupom');
    try {
      // token = await refreshToken();
      redirectToLogin();
      return null;
    } catch (error) {
      // console.error('Failed to refresh token', error);
      // Handle token refresh failure, e.g., logout user
      localStorage.removeItem('userInfo');
      // localStorage.removeItem('refreshToken');
      redirectToLogin();

      return null;
    }
  } else if (!token) {
    // toast.error('No Token Found!');
    console.error('No Token Found!');
    redirectToLogin();
    return null;
  }

  return token;
};
