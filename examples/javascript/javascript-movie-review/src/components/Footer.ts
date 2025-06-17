import { Component } from "@guesung/component";
import { html } from "@/utils";

export default class Footer extends Component {
	override template() {
		return html`
      <footer class="footer">
        <p>&copy; 우아한테크코스 All Rights Reserved.</p>
        <p><img src="./images/woowacourse_logo.png" width="180" /></p>
      </footer>
    `;
	}
}
