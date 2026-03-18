"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
	trigger: React.ReactElement;
	children: React.ReactNode;
	align?: "start" | "center" | "end";
	side?: "top" | "bottom";
	sideOffset?: number;
	className?: string;
}

function DropdownMenu({
	trigger,
	children,
	align = "end",
	side = "bottom",
	sideOffset = 4,
	className,
}: DropdownMenuProps) {
	return (
		<MenuPrimitive.Root data-slot="dropdown-menu">
			<MenuPrimitive.Trigger
				data-slot="dropdown-menu-trigger"
				render={trigger}
			/>
			<MenuPrimitive.Portal>
				<MenuPrimitive.Positioner
					data-slot="dropdown-menu-positioner"
					side={side}
					align={align}
					sideOffset={sideOffset}
					className="isolate z-10005 outline-none"
				>
					<MenuPrimitive.Popup
						data-slot="dropdown-menu-content"
						className={cn(
							"animate-popover-in z-10005 max-h-(--available-height) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md border border-zinc-200 bg-white p-1 text-zinc-900 shadow-md ring-1 ring-zinc-950/5 outline-none",
							className,
						)}
					>
						{children}
					</MenuPrimitive.Popup>
				</MenuPrimitive.Positioner>
			</MenuPrimitive.Portal>
		</MenuPrimitive.Root>
	);
}

interface DropdownItemProps {
	children: React.ReactNode;
	onSelect?: () => void;
	disabled?: boolean;
	className?: string;
}

function DropdownItem({
	children,
	onSelect,
	disabled,
	className = "",
}: DropdownItemProps) {
	return (
		<MenuPrimitive.Item
			data-slot="dropdown-menu-item"
			onSelect={onSelect}
			disabled={disabled}
			className={cn(
				"group/dropdown-menu-item relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-zinc-700 outline-none select-none data-highlighted:bg-zinc-100 data-highlighted:text-zinc-900 data-disabled:pointer-events-none data-disabled:opacity-50",
				className,
			)}
		>
			{children}
		</MenuPrimitive.Item>
	);
}

export { DropdownMenu, DropdownItem };
