import { CustomDirectusTypes } from "./types";

declare global {
  interface DirectusSchema extends CustomDirectusTypes {}
}
