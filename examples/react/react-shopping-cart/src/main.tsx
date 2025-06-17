import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./styles/main.css";

async function enableMocking() {
	const { worker } = await import("./mocks/browser.js");

	return worker.start({
		serviceWorker: {
			url:
				process.env.NODE_ENV === "production"
					? "/guesung-libraries/react-shopping-cart/mockServiceWorker.js"
					: "/mockServiceWorker.js",
		},
	});
}

enableMocking().then(() => {
	ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
});
