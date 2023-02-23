import {
  CustomDirectusTypes,
  Todo as _Todo,
  DirectusFiles as _DirectusFiles,
  TodoFiles as _TodoFiles,
} from "./types";

declare global {
  type MyDirectusTypes = CustomDirectusTypes;
  type Todo = _Todo;
  type DirectusFiles = _DirectusFiles;
  type TodoFiles = _TodoFiles;
}
