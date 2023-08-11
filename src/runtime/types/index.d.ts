export * from "./config";
export * from "./modules";

export type LoggedIn = "yes" | "no";

export interface AuthStorageData {
  access_token: string | null | undefined;
  refresh_token: string | null | undefined;
  logged_in: LoggedIn;
}

export interface AuthStorage {
  get: () => AuthStorageData;
  set: ({ access_token: string, logged_in: LoggedIn }) => void;
  clear: () => void;
}
