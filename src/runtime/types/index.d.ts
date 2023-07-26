export * from "./config";
export * from "./modules";

interface AuthStorageData {
  access_token: string | null | undefined;
  refresh_token: string | null | undefined;
}

export interface AuthStorage {
  get: () => AuthStorageData;
  set: ({ access_token: string, expires: number }) => void;
  clear: () => void;
}
