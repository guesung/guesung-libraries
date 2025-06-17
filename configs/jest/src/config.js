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

const coverageSettings = {
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageReporters: ["text", "lcov"],
	collectCoverageFrom: ["src/**/*.{js,ts,tsx}", "!src/**/*.d.ts", "!index.ts"],
	coveragePathIgnorePatterns: ["index.ts"],
	coverageThreshold: {
		global: {
			branches: 90,
			functions: 90,
			lines: 90,
			statements: 90,
		},
	},
};

module.exports = {
	defaultSettings,
	coverageSettings,
};
