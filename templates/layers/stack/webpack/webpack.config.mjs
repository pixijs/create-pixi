import path from "node:path";

import CopyPlugin from "copy-webpack-plugin";
import { EsbuildPlugin } from "esbuild-loader";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default (_env, argv) => {
  const isDev = argv.mode === "development";

  return {
    stats: "minimal", // Keep console output easy to read.
    entry: "./src/main.ts", // Your program entry point

    // Your build destination
    output: {
      path: path.resolve(import.meta.dirname, "dist"),
      filename: "[name].[contenthash].js",
      clean: true,
    },

    // Config for your testing server
    devServer: {
      port: 8080,
      open: true,
      static: false,
      client: {
        logging: "warn",
        overlay: {
          errors: true,
          warnings: false,
        },
        progress: true,
      },
    },

    // Web games are bigger than pages, disable the warnings that our game is too big.
    performance: { hints: false },

    // Enable sourcemaps while debugging
    devtool: isDev ? "eval-source-map" : false,

    // Transpile source files with esbuild
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          loader: "esbuild-loader",
          options: { target: "es2022" },
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },

    // Minify the code and strip console.* calls when making a final build
    optimization: {
      minimizer: [
        new EsbuildPlugin({
          target: "es2022",
          drop: ["console"],
          legalComments: "none",
        }),
      ],
    },

    plugins: [
      // Copy our static assets to the final build
      new CopyPlugin({
        patterns: [{ from: "public" }],
      }),

      // Make an index.html from the template
      new HtmlWebpackPlugin({
        template: "index.html",
      }),
    ],
  };
};
