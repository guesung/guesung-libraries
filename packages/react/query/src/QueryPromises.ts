const queryPromises = new Map<string, Promise<unknown>>();

// 테스트용: 모든 캐시 초기화
export function __clearAll() {
  queryPromises.clear();
}

export function getQueryPromise(queryKey: string) {
  return queryPromises.get(queryKey);
}

export function setQueryPromise(queryKey: string, promise: Promise<unknown>) {
  queryPromises.set(queryKey, promise);
}

export function clearQueryPromise(queryKey: string) {
  queryPromises.delete(queryKey);
}
