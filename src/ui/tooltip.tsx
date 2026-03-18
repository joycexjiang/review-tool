"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";

type TooltipProviderProps = ComponentProps<typeof BaseTooltip.Provider>;

interface TooltipProps {
	label: ReactNode;
	side?: "top" | "bottom" | "left" | "right";
	sideOffset?: number;
	children: ReactElement;
	className?: string;
}

function TooltipProvider({ children, ...props }: TooltipProviderProps) {
	return <BaseTooltip.Provider {...props}>{children}</BaseTooltip.Provider>;
}

function Tooltip({
	label,
	side = "bottom",
	sideOffset = 6,
	children,
	className,
}: TooltipProps) {
	return (
		<BaseTooltip.Root>
			<BaseTooltip.Trigger render={children} />
			<BaseTooltip.Portal>
				<BaseTooltip.Positioner
					side={side}
					sideOffset={sideOffset}
					className="z-10001 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) outline-none"
				>
					<BaseTooltip.Popup
						className={cn(
							"relative flex flex-col rounded-md bg-zinc-900 px-2 py-1 text-sm font-medium text-white origin-(--transform-origin) shadow-lg shadow-zinc-950/15 transition-[transform,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-90 data-starting-style:opacity-0",
							className,
						)}
					>
						<BaseTooltip.Arrow className="absolute flex data-[side=bottom]:-top-2 data-[side=bottom]:rotate-0 data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:-bottom-2 data-[side=top]:rotate-180">
							<TooltipArrow />
						</BaseTooltip.Arrow>
						{label}
					</BaseTooltip.Popup>
				</BaseTooltip.Positioner>
			</BaseTooltip.Portal>
		</BaseTooltip.Root>
	);
}

function TooltipArrow(props: ComponentProps<"svg">) {
	return (
		<svg
			width="20"
			height="10"
			viewBox="0 0 20 10"
			fill="none"
			aria-hidden="true"
			focusable="false"
			{...props}
		>
			<title>Tooltip arrow</title>
			<path
				d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
				className="fill-zinc-900"
			/>
		</svg>
	);
}

export { Tooltip, TooltipProvider };
