interface Rest {}

interface Graphql {}

interface Realtime {}

interface Authentication {
  enableGlobalAuthMiddleware: boolean;
  refreshTokenCookieName: string;
  accessTokenCookieName: string;
  msRefreshBeforeExpires: number;
  redirect: {
    login: string;
    logout: string;
    home: string;
    callback: string;
    resetPassword: string;
  };
}

export interface PublicConfig {
  baseUrl: string;
  nuxtBaseUrl: string;
  rest: Rest;
  auth: Authentication;
  graphql: Graphql;
  realtime: Realtime;
}
