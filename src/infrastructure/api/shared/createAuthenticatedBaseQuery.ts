import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getToken } from '../../Auth/JWTSecurity/jwtTokenManager';

/**
 * Shared RTK Query baseQuery with Bearer token from jwtTokenManager.
 * Prefer this for new / migrated ApiSlices.
 */
export function createAuthenticatedBaseQuery(
  controllerName: string
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> {
  return fetchBaseQuery({
    baseUrl: `${window.API_BASE_URL}/${controllerName}/`,
    prepareHeaders: async (headers) => {
      const token = await getToken();
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  });
}
