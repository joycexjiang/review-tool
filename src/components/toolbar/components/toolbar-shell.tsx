"use client";

import { cn } from "@/lib/utils";
import { useToolbarLayoutContext } from "../toolbar-context";

export default function ToolbarShell({
	children,
}: {
	children: React.ReactNode;
}) {
	const {
		elementRef,
		isDrawerOpen,
		onPointerCancel,
		onPointerDown,
		onPointerMove,
		onPointerUp,
		style,
	} = useToolbarLayoutContext();

	return (
		<div
			ref={elementRef}
			data-toolbar
			style={style}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onPointerCancel={onPointerCancel}
			className={cn(
				"fixed z-10003 flex select-none items-center gap-1 rounded-full border border-primary bg-primary p-1 shadow-sm inset-border-secondary backdrop-blur",
				isDrawerOpen ? "" : "cursor-grab active:cursor-grabbing",
			)}
		>
			{children}
		</div>
	);
}
