import { join } from "@fxts/core";

class Cache {
	#cache = new Map<string, unknown>();

	get(key: string) {
		return this.#cache.get(key);
	}

	set(key: string, value: unknown) {
		this.#cache.set(key, value);
	}
}

interface Query<TResponse> {
	queryKey: (string | number)[];
	queryFn: () => Promise<TResponse>;
}

class ServerStore {
	#cache = new Cache();

	async query<TResponse>({ queryKey, queryFn }: Query<TResponse>) {
		const queryKeyString = join("-", queryKey);
		const cachedValue = this.#cache.get(queryKeyString);
		if (cachedValue) return cachedValue as TResponse;

		const response = await queryFn();
		this.#cache.set(queryKeyString, response);

		return response;
	}
}

const serverStore = new ServerStore();
export default serverStore;
