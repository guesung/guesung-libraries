import { $ } from "@/utils";
import { Component, type Props, type State } from "@guesung/component";

export default abstract class Modal<
	TProps extends Props = Props,
	TState extends State = State,
> extends Component<TProps, TState> {
	abstract id: string;

	update() {
		this.render();
		this.show();
	}

	show() {
		$(`#${this.id}`).appendChild(this.element);
		this.onShow();
	}

	onShow() {}

	disableScrollOutside() {
		document.body.style.overflow = "hidden";
	}

	enableScrollOutside() {
		document.body.style.overflow = "scroll";
	}
}
