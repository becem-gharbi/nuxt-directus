export * from "./config";
export * from "./modules";

export interface AuthenticationData {
  data: {
    access_token: string;
  };
}
