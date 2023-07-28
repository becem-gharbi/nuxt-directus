// https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql

const endpoint =
  "http://127.0.0.1:8055?access_token=pT9Jm6MG5ajHjH1VQFtXLJYI1-8hsTO5"; // Make sure WEBSOCKETS_GRAPHQL_AUTH=strict

module.exports = {
  projects: {
    app: {
      schema: [endpoint],
      documents: [
        "./pages/**/*.vue",
        "./components/**/*.vue",
        "./composables/**/*.ts",
        "./app.vue",
      ],
    },
  },
};
