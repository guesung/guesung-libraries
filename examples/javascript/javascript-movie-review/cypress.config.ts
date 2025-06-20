import { defineConfig } from "cypress";

import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
	e2e: {
		experimentalStudio: true,
		baseUrl: process.env.VITE_BASE_URL ?? "http://localhost:5173",
		video: true,
		env: {
			VITE_TMDB_TOKEN: process.env.VITE_TMDB_TOKEN,
		},
	},
});
