import { Component } from "@guesung/component";

export default class App extends Component {
  template() {
    return `<div>Hello World</div>`;
  }

  onRender() {
    console.log("onRender");
  }
}
