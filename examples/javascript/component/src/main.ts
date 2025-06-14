import { App } from "./components";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.appendChild(new App().element);
