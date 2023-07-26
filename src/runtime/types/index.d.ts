export * from "./config";
export * from "./modules";

interface AuthStorageData {
  access_token: string | null;
  expires?: number | null;
  refresh_token?: string | null;
}

export interface AuthStorage {
  /**
   * Holds access token in-memory for server-side usage
   */
  _temp: string | null;
  get: () => AuthStorageData;
  set: (data: AuthStorageData) => void;
  clear: () => void;
}
