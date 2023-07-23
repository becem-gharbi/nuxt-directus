import type {
  AuthenticationStorage,
  AuthenticationData,
  DirectusUser,
  DirectusClient,
} from "@directus/sdk";

import type { Ref } from "#imports";

export * from "./config";

export {
  Ref,
  AuthenticationStorage,
  AuthenticationData,
  DirectusUser,
  DirectusClient,
};

export interface LoginCredentials {
  email: string;
  password: string;
}
