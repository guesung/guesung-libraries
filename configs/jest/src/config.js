const defaultSettings = {
  moduleNameMapper: {
    "^.+\\.svg$": "jest-svg-transformer",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "@/(.*)": "<rootDir>/src/$1",
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js", "<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/esm/"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  moduleDirectories: ["node_modules", "src"],
};

function settings(extraSettings) {
  const settings = {
    ...defaultSettings,
    ...extraSettings,
  };

  return settings;
}

module.exports = settings;
