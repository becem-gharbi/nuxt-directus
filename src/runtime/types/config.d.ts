import type {
  RestConfig,
  AuthenticationConfig,
  AuthenticationMode,
} from "@directus/sdk";

interface Rest extends RestConfig {}

interface Graphql {}

interface Realtime {}

interface Authentication extends AuthenticationConfig {
  mode: AuthenticationMode;
  staticToken?: string;
  defaultRoleId?: string;
  enableGlobalAuthMiddleware?: boolean;
  userFields?: string[];
  refreshTokenCookieName?: string;
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
  rest?: Rest;
  auth?: Authentication;
  graphql?: Graphql;
  realtime?: Realtime;
}
