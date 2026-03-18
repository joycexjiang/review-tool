import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export default function CheckIcon({
	className,
	...props
}: ComponentProps<"svg">) {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			className={cn("shrink-0", className)}
			aria-label="Check"
			role="img"
			{...props}
		>
			<path
				d="M18.9685 4.29332C19.3589 3.72399 20.1374 3.57875 20.7067 3.9691C21.2761 4.3595 21.4213 5.13803 21.031 5.70738L10.7448 20.7074C10.5228 21.0311 10.1613 21.2319 9.76923 21.2494C9.3772 21.2667 8.99951 21.0989 8.7497 20.7962L3.03584 13.8734L2.95966 13.7699C2.60796 13.2431 2.70497 12.5256 3.2038 12.1136C3.70295 11.7016 4.42703 11.7415 4.87763 12.1869L4.96357 12.2816L9.41049 17.6682C9.51631 17.7964 9.71545 17.7876 9.80946 17.6505L18.9685 4.29332Z"
				fill="currentColor"
			/>
		</svg>
	);
}
