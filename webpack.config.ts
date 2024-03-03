import { CleanWebpackPlugin } from "clean-webpack-plugin";
import EslintWebpackPlugin from "eslint-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import NodemonWebpackPlugin from "nodemon-webpack-plugin";
import * as path from "path";
import { Configuration, WebpackPluginInstance } from "webpack";
import WebpackNodeExternals from "webpack-node-externals";

const modes = ["development", "production"] as const;

type Mode = (typeof modes)[number];

function isValidMode(value: string): value is Mode {
  return (modes as ReadonlyArray<string>).includes(value);
}

const env = process.env.NODE_ENV;
const mode = env && isValidMode(env) ? env : "development";

const plugins: Array<WebpackPluginInstance> = [
  new CleanWebpackPlugin(),
  new EslintWebpackPlugin({ extensions: ["ts"], files: "src" }),
  new ForkTsCheckerWebpackPlugin(),
];

if (mode === "development") {
  const nodemonWebpackPlugin = new NodemonWebpackPlugin({
    ext: "js",
    quiet: true,
    script: "build/index.js",
    watch: ["build"],
  });

  plugins.push(nodemonWebpackPlugin);
}

const config: Configuration = {
  devtool: mode === "development" ? "source-map" : false,
  entry: [path.resolve(__dirname, "src/index.ts")],
  externals: [WebpackNodeExternals()],
  mode,
  module: {
    rules: [{ exclude: /node_modules/, test: /\.(ts)$/, use: "esbuild-loader" }],
  },
  output: {
    clean: true,
    filename: "index.js",
    path: path.resolve(__dirname, "build"),
  },
  plugins,
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
    extensions: [".js", ".ts"],
  },
  stats: {
    preset: "errors-warnings",
  },
  target: "node",
};

export default config;
