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
	sideOffset = 6,
	className,
}: DropdownMenuProps) {
	return (
		<MenuPrimitive.Root data-slot="dropdown-menu">
			<MenuPrimitive.Trigger
				data-slot="dropdown-menu-trigger"
				render={trigger}
				className="data-popup-open:bg-[#ECECEC] data-popup-open:hover:bg-[#ECECEC]"
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
							"z-10005 max-h-(--available-height) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-xl shadow-sm bg-white p-1 text-zinc-500 ring-1 ring-zinc-950/2 outline-none transition-[transform,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
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
			onClick={onSelect}
			disabled={disabled}
			className={cn(
				"group/dropdown-menu-item relative flex w-full cursor-default items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-700 outline-none select-none data-highlighted:bg-zinc-100 data-highlighted:text-zinc-900 data-disabled:pointer-events-none data-disabled:opacity-50",
				className,
			)}
		>
			{children}
		</MenuPrimitive.Item>
	);
}

export { DropdownMenu, DropdownItem };
