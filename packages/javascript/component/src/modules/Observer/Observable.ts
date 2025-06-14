import { forEach } from "@fxts/core";

type TListener<TState> = (state: TState) => void;

export default abstract class Observable<TState> {
  #listeners: TListener<TState>[] = [];

  subscribe(listener: TListener<TState>) {
    this.#listeners = [...this.#listeners, listener];
  }

  notify(nextState: TState) {
    forEach((listener) => {
      listener(nextState);
    }, this.#listeners);
  }
}
