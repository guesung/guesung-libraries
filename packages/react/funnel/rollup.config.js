const { config } = require("@guesung/rollup-config");

module.exports = {
  ...config({
    packageJson: require("./package.json"),
  }),
};
