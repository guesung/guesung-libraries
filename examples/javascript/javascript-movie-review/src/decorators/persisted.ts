import { LocalStorage, type LocalStorageKeyType } from "@/modules";
import type { Store } from "@/store";

export const persisted = <TState>(
	key: LocalStorageKeyType,
	store: Store<TState>,
) => {
	store.setState(LocalStorage.get(key) ?? store.getState());

	store.subscribe((state) => LocalStorage.set(key, state));

	return store;
};
