const queryPromises = new Map<string, Promise<unknown>>();

export function getQueryPromise(queryKey: string) {
	return queryPromises.get(queryKey);
}

export function setQueryPromise(queryKey: string, promise: Promise<unknown>) {
	queryPromises.set(queryKey, promise);
}

export function clearQueryPromise(queryKey: string) {
	queryPromises.delete(queryKey);
}

/** @internal 테스트 전용 */
export function __clearAll() {
	queryPromises.clear();
}
