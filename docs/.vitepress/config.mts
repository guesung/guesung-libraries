import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "Guesung Libraries",
	description: "All about guesung libraries",
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "홈", link: "/" },
			{
				text: "라이브러리 목록",
				link: "/libraries",
				activeMatch: "/libraries",
			},
			{
				text: "예시 프로젝트",
				link: "/examples",
				activeMatch: "/examples",
			},
		],

		search: {
			provider: "local",
		},

		sidebar: {
			"/libraries": [
				{
					text: "JavaScript",
					items: [
						{
							text: "api",
							link: "/libraries/javascript/api",
						},
						{
							text: "component",
							link: "/libraries/javascript/component",
						},
					],
				},
				{
					text: "React",
					items: [
						{ text: "funnel", link: "/libraries/react/funnel" },
						{ text: "query", link: "/libraries/react/query" },
					],
				},
			],
			"/examples/": [
				{
					text: "JavaScript",
					items: [
						{
							text: "react-shopping-cart",
							link: "/examples/react/react-shopping-cart",
						},
					],
				},
				{
					text: "React",
					items: [
						{
							text: "javascript-movie-review",
							link: "/examples/javascript/javascript-movie-review",
						},
					],
				},
			],
		},

		socialLinks: [
			{ icon: "github", link: "https://github.com/guesung/guesung-libraries" },
		],
	},
});
