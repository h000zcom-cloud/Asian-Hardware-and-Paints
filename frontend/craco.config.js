// craco.config.js
const path = require("path");

module.exports = {
  // react-scripts 5 supplies the v4 middleware hooks, while the locked
  // webpack-dev-server is v5. Translate the hooks for the local dev server.
  devServer: (config) => {
    const { onBeforeSetupMiddleware, onAfterSetupMiddleware, https, ...rest } = config;
    return {
      ...rest,
      server: https ? { type: 'https', options: typeof https === 'object' ? https : {} } : 'http',
      setupMiddlewares: (middlewares, devServer) => {
        onBeforeSetupMiddleware?.(devServer);
        onAfterSetupMiddleware?.(devServer);
        return middlewares;
      },
    };
  },
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: (webpackConfig) => {
      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/build/**",
          "**/dist/**",
          "**/coverage/**",
          "**/public/**",
        ],
      };
      return webpackConfig;
    },
  },
};
