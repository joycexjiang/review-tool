"use client";

import type { ToolbarSide } from "@/components/inspector/state/types";
import { useDockedFloatingPosition } from "@/hooks/use-docked-floating-position";

export function useDraggableToolbar(
	side: ToolbarSide,
	y: number | null,
	onSideChange?: (side: ToolbarSide) => void,
	onWidthChange?: (width: number) => void,
	onYChange?: (y: number | null) => void,
) {
	return {
		...useDockedFloatingPosition({
			side,
			y,
			defaultBottom: 20,
			onSideChange,
			onWidthChange,
			onYChange,
			canStartDrag: (target) => !target.closest("button"),
		}),
	};
}
