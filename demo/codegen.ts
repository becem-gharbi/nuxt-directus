// https://the-guild.dev/graphql/codegen/docs/guides/react-vue

import type { CodegenConfig } from "@graphql-codegen/cli";

const endpoint =
  "http://127.0.0.1:8055?access_token=pT9Jm6MG5ajHjH1VQFtXLJYI1-8hsTO5"; // Make sure WEBSOCKETS_GRAPHQL_AUTH=strict

const config: CodegenConfig = {
  schema: endpoint,
  documents: [
    "./pages/**/*.vue",
    "./components/**/*.vue",
    "./composables/**/*.ts",
    "./app.vue",
  ],
  ignoreNoDocuments: true,
  generates: {
    "./gql/": {
      preset: "client",
      config: {
        useTypeImports: true,
      },
    },
  },
};

export default config;
