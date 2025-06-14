const defaultSettings = {
  testEnvironment: "jest-fixed-jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest"],
  },
  moduleNameMapper: {
    "^.+\\.svg$": "jest-svg-transformer",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "@/(.*)": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

function settings(extraSettings) {
  const settings = {
    ...defaultSettings,
    ...extraSettings,
  };

  return settings;
}

module.exports = settings;
