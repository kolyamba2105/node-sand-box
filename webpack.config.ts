import { CleanWebpackPlugin } from "clean-webpack-plugin";
import EslintWebpackPlugin from "eslint-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import NodemonWebpackPlugin from "nodemon-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";
import "webpack-dev-server";
import WebpackNodeExternals from "webpack-node-externals";

const modes = ["development", "production"] as const;

type Mode = (typeof modes)[number];

function isValidMode(value: string): value is Mode {
  return (modes as ReadonlyArray<string>).includes(value);
}

const env = process.env.NODE_ENV;
const mode = env && isValidMode(env) ? env : "development";

function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

function compact<T>(values: Array<T>): Array<NonNullable<T>> {
  return values.filter(isNonNullable);
}

const server: webpack.Configuration = {
  devtool: mode === "development" ? "source-map" : false,
  entry: [path.resolve(__dirname, "src/index.ts")],
  externals: [WebpackNodeExternals()],
  mode,
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: "asset/resource",
      },
      {
        exclude: /node_modules/,
        test: /\.(ts|tsx)$/,
        use: "esbuild-loader",
      },
    ],
  },
  output: {
    clean: true,
    filename: "index.js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: compact([
    new CleanWebpackPlugin(),
    new EslintWebpackPlugin({ extensions: ["ts"], files: "src" }),
    new ForkTsCheckerWebpackPlugin(),
    mode === "development" ? new NodemonWebpackPlugin({ quiet: true }) : null,
  ]),
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

export default server;
