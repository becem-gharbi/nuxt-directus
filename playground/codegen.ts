// https://the-guild.dev/graphql/codegen/docs/guides/react-vue

import type { CodegenConfig } from "@graphql-codegen/cli";

const directusBaseUrl = "http://127.0.0.1:8055";
const staticToken = "pT9Jm6MG5ajHjH1VQFtXLJYI1-8hsTO5"; // Make sure WEBSOCKETS_GRAPHQL_AUTH=strict

const config: CodegenConfig = {
  schema: `${directusBaseUrl}/graphql?access_token=${staticToken}`,
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
