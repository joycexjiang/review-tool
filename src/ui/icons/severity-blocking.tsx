import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export default function SeverityBlockingIcon({
	className,
	...props
}: ComponentProps<"svg">) {
	return (
		<svg
			width="90"
			height="90"
			viewBox="0 0 90 90"
			fill="none"
			className={cn("shrink-0", className)}
			aria-label="Blocking severity"
			role="img"
			{...props}
		>
			<rect
				x="16"
				y="43.5142"
				width="14.0286"
				height="28.0571"
				rx="3.50714"
				fill="#535354"
			/>
			<rect
				x="38.0286"
				y="31.5713"
				width="14"
				height="40"
				rx="3.50714"
				fill="#535354"
			/>
			<rect
				x="60.0286"
				y="17.5713"
				width="14"
				height="54"
				rx="3.50714"
				fill="#535354"
			/>
		</svg>
	);
}
