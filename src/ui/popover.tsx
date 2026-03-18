"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";

function Popover(
	props: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>,
) {
	return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger(
	props: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>,
) {
	return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

type PopoverContentProps = React.ComponentPropsWithoutRef<
	typeof PopoverPrimitive.Popup
> &
	Pick<
		React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Positioner>,
		"side" | "align" | "sideOffset"
	> & {
		positionerClassName?: string;
		arrowClassName?: string;
	};

function PopoverContent({
	className,
	children,
	side = "bottom",
	align = "center",
	sideOffset = 8,
	positionerClassName,
	arrowClassName,
	...props
}: PopoverContentProps) {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Positioner
				side={side}
				align={align}
				sideOffset={sideOffset}
				className={cn(
					"z-10000 h-(--positioner-height) w-(--positioner-width) max-w-[calc(100vw-1rem)]",
					positionerClassName,
				)}
			>
				<PopoverPrimitive.Popup
					data-slot="popover-content"
					className={cn(
						"relative origin-(--transform-origin) outline-none transition-[transform,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-95 data-starting-style:opacity-0",
						className,
					)}
					{...props}
				>
					<PopoverPrimitive.Arrow
						className={cn(
							"absolute flex data-[side=bottom]:-top-2 data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:-bottom-2 data-[side=top]:rotate-180",
							arrowClassName,
						)}
					>
						<PopoverArrow />
					</PopoverPrimitive.Arrow>
					{children}
				</PopoverPrimitive.Popup>
			</PopoverPrimitive.Positioner>
		</PopoverPrimitive.Portal>
	);
}

function PopoverArrow(props: React.ComponentProps<"svg">) {
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
			<path
				d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
				className="fill-white"
			/>
			<path
				d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
				className="fill-zinc-200"
			/>
		</svg>
	);
}

export { Popover, PopoverContent, PopoverTrigger };
