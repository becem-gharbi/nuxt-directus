import type { CodegenConfig } from "@graphql-codegen/cli";

const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhmNTczYjhkLTYzNzEtNGIyYy1iZGQxLWIyYjYxOGJkOTYxMyIsInJvbGUiOiJmYjFlMTQxOS04ZDJiLTQ4MzMtYjJjMS1mNWY0ZmVlNzUzYTQiLCJhcHBfYWNjZXNzIjp0cnVlLCJhZG1pbl9hY2Nlc3MiOnRydWUsImlhdCI6MTY5MDU2NDkxNCwiZXhwIjoxNjkwNTY1ODE0LCJpc3MiOiJkaXJlY3R1cyJ9.lgFqZYVdf_rVjWQN__QWUG6mz9xVI2q9ySJ31Hm0nOI";

const config: CodegenConfig = {
  schema: `http://127.0.0.1:8055/graphql?access_token=${access_token}`,
  documents: ["./**/*.vue"],
  ignoreNoDocuments: true, // for better experience with the watcher
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
