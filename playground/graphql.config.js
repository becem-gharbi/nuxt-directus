// https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql

const directusBaseUrl = "http://127.0.0.1:8055";
const staticToken = "pT9Jm6MG5ajHjH1VQFtXLJYI1-8hsTO5"; // Make sure WEBSOCKETS_GRAPHQL_AUTH=strict

module.exports = {
  projects: {
    app: {
      schema: [`${directusBaseUrl}/graphql?access_token=${staticToken}`],
      documents: [
        "./pages/**/*.vue",
        "./components/**/*.vue",
        "./composables/**/*.ts",
        "./app.vue",
      ],
    },
  },
};
