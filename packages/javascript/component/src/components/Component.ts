import type { Observer } from "@/modules";
import type { HTMLType, StrictObject } from "@/types";
import { $, html } from "@/utils";
import { forEach } from "@fxts/core";

export type Props = StrictObject | null;
export type State = StrictObject | null;

export default abstract class Component<
	TProps extends Props = Record<string, unknown>,
	TState extends State = Record<string, unknown>,
> implements Observer<unknown>
{
	state = {} as TState;

	#props: TProps;
	#element: HTMLElement | null = null;

	constructor(props?: TProps) {
		this.#props = (props ?? {}) as TProps;
		this.setup();

		this.render();
		this.addEventListener();
	}

	// biome-ignore lint/suspicious/noExplicitAny: TODO
	subscribe(stores: any[]) {
		forEach((store) => {
			store.subscribe(this.update.bind(this));
		}, stores);
	}

	update() {
		this.render();
	}

	setup() {}

	render() {
		const element = document.createElement("div");
		element.innerHTML = this.template();

		const elementFirstChild = element.firstElementChild as HTMLElement;

		if (!this.#element) this.#element = elementFirstChild;
		else this.#element.innerHTML = elementFirstChild.innerHTML;

		this.onRender();

		return this.#element;
	}

	setState(nextState: Partial<TState>) {
		this.state = { ...this.state, ...nextState };
		this.render();
	}

	template(): HTMLType {
		return html`<div></div>`;
	}

	fillSlot(component: Component, slotName: string) {
		const targetSlot = $(`slot[name=${slotName}]`, this.element);
		if (!targetSlot) throw new Error(`slot not found: ${slotName}`);

		targetSlot.replaceWith(component.element);
	}

	remove() {
		this.onUnmount();
		this.element.remove();
	}

	get element() {
		if (!this.#element)
			throw new Error("Component element is not initialized yet.");

		return this.#element;
	}

	get props() {
		return this.#props;
	}

	addEventListener() {}

	onRender() {}

	protected onUnmount() {}
}
