export interface IApiResult<T> {
  messages: string[];
  succeeded: boolean;
  data: T;
  validationErrors?: { errorMessage: string; memberNames?: string[] }[];
  exception?: unknown;
  code?: number;
}
