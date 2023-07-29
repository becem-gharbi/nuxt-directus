import { defineNuxtPlugin, useDirectusAuth } from "#imports";

export default defineNuxtPlugin({
  enforce: "pre",
  hooks: {
    "apollo:http-auth": async (args) => {
      const { getToken } = useDirectusAuth();

      const accessToken = await getToken();

      args.token = accessToken || null;
    },
    "apollo:ws-auth": async (args) => {
      const { getToken } = useDirectusAuth();

      const accessToken = await getToken();

      args.params = {
        access_token: accessToken || null,
      };
    },
  },
});
