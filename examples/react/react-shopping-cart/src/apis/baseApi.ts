import { CONFIG } from "@/constants";
import { Api } from "@guesung/api";

export const baseApi = new Api(CONFIG.baseUrl, {
	headers: {
		Authorization: `Basic ${CONFIG.token}`,
		"Content-Type": "application/json",
	},
});
