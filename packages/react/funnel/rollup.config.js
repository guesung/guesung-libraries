const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const terser = require("@rollup/plugin-terser");

const packageJson = require("./package.json");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  input: "src/index.ts",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: !isProduction,
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: !isProduction,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
    terser(),
  ],
  external: ["react", "react-dom"],
};
