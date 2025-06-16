import { type Listener, Observer } from "./Observer";
import type { QueryKey, Status } from "./type";

// Data
const dataStore: Record<QueryKey, unknown> = {};
const dataObservers: Record<QueryKey, Observer> = {};

// 테스트용: 모든 캐시 초기화
export function __clearAll() {
	for (const k of Object.keys(dataStore)) delete dataStore[k];
	for (const k of Object.keys(dataObservers)) delete dataObservers[k];
	for (const k of Object.keys(statusStore)) delete statusStore[k];
	for (const k of Object.keys(statusObservers)) delete statusObservers[k];
}

export const setQueryData = (key: QueryKey, value: unknown) => {
	dataStore[key] = value;
	dataObservers[key]?.notify();
};

export const getQueryData = (key: QueryKey) => dataStore[key];

export const subscribeQueryData = (key: QueryKey, listener: Listener) => {
	if (!dataObservers[key]) dataObservers[key] = new Observer();
	dataObservers[key].add(listener);
	return () => dataObservers[key]?.remove(listener);
};

// Status

const statusStore: Record<QueryKey, Status> = {};
const statusObservers: Record<QueryKey, Observer> = {};

export const setQueryStatus = (key: QueryKey, status: Status) => {
	statusStore[key] = status;
	statusObservers[key]?.notify();
};

export const getQueryStatus = (key: QueryKey): Status =>
	statusStore[key] ?? "idle";

export const subscribeQueryStatus = (key: QueryKey, listener: Listener) => {
	if (!statusObservers[key]) statusObservers[key] = new Observer();
	statusObservers[key].add(listener);
	return () => statusObservers[key]?.remove(listener);
};
