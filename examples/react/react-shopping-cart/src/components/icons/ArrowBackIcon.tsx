import type { SVGProps } from "react";

export default function ArrowBackIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="25"
			height="24"
			viewBox="0 0 25 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<title>Arrow Back</title>
			<path
				d="M2.58325 12L1.41195 11.063L0.662315 12L1.41195 12.9371L2.58325 12ZM23.4166 13.5C24.245 13.5 24.9166 12.8285 24.9166 12C24.9166 11.1716 24.245 10.5 23.4166 10.5V13.5ZM10.9166 1.58336L9.74528 0.64632L1.41195 11.063L2.58325 12L3.75456 12.9371L12.0879 2.52041L10.9166 1.58336ZM2.58325 12L1.41195 12.9371L9.74528 23.3537L10.9166 22.4167L12.0879 21.4797L3.75456 11.063L2.58325 12ZM2.58325 12V13.5H23.4166V12V10.5H2.58325V12Z"
				fill="white"
			/>
		</svg>
	);
}
