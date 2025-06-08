const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const terser = require("@rollup/plugin-terser");

const isProduction = process.env.NODE_ENV === "production";

const defaultSettings = ({ packageJson }) => ({
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
});

function config(extraSettings) {
  const settings = {
    ...defaultSettings(extraSettings),
    ...extraSettings,
  };

  return settings;
}

module.exports = config;
