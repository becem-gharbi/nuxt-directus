export * from "./config";
export * from "./modules";

interface AuthStorageData {
  access_token: string | null;
  expires?: number | null;
  refresh_token?: string | null;
}

export interface AuthStorage {
  get: () => AuthStorageData;
  set: (data: AuthStorageData) => void;
  clear: () => void;
}
