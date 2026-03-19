"use client";

import { useMemo } from "react";
import type { ToolbarSide } from "@/components/inspector/state/types";
import { useDockedFloatingPosition } from "@/hooks/use-docked-floating-position";
import { useViewportSize } from "@/hooks/use-viewport-size";
import type { ToolbarLayoutValue } from "../toolbar-context";

const TOOLBAR_DEFAULT_BOTTOM = 20;
const TOOLBAR_DEFAULT_HEIGHT = 42;

interface UseToolbarLayoutOptions {
	panelMode: "floating" | "drawer";
	panelOpen: boolean;
	toolbarHeight: number;
	toolbarSide: ToolbarSide;
	toolbarX: number | null;
	toolbarY: number | null;
	setToolbarHeight: (height: number) => void;
	setToolbarSide: (side: ToolbarSide) => void;
	setToolbarWidth: (width: number) => void;
	setToolbarX: (x: number | null) => void;
	setToolbarY: (y: number | null) => void;
}

export function useToolbarLayout({
	panelMode,
	panelOpen,
	toolbarHeight,
	toolbarSide,
	toolbarX,
	toolbarY,
	setToolbarHeight,
	setToolbarSide,
	setToolbarWidth,
	setToolbarX,
	setToolbarY,
}: UseToolbarLayoutOptions): ToolbarLayoutValue {
	const viewportSize = useViewportSize();
	const viewportHeight = viewportSize?.height ?? null;
	const viewportWidth = viewportSize?.width ?? null;
	const isDrawerOpen = panelOpen && panelMode === "drawer";
	const {
		elementRef,
		positionStyle,
		handlePointerCancel,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
	} = useDockedFloatingPosition({
		side: toolbarSide,
		x: toolbarX,
		y: toolbarY,
		viewportHeight,
		viewportWidth,
		defaultBottom: TOOLBAR_DEFAULT_BOTTOM,
		onHeightChange: setToolbarHeight,
		onSideChange: setToolbarSide,
		onWidthChange: setToolbarWidth,
		onXChange: setToolbarX,
		onYChange: setToolbarY,
		canStartDrag: (target) => !target.closest("button"),
	});

	const isHorizontalEdge =
		toolbarSide === "top" || toolbarSide === "bottom";

	return useMemo(() => {
		const resolvedToolbarHeight = toolbarHeight || TOOLBAR_DEFAULT_HEIGHT;
		const defaultFloatingToolbarTop = `calc(50vh - ${resolvedToolbarHeight / 2}px)`;

		return {
			elementRef,
			isDrawerOpen,
			onPointerCancel: isDrawerOpen ? undefined : handlePointerCancel,
			onPointerDown: isDrawerOpen ? undefined : handlePointerDown,
			onPointerMove: isDrawerOpen ? undefined : handlePointerMove,
			onPointerUp: isDrawerOpen ? undefined : handlePointerUp,
			style: isDrawerOpen
				? {
						left: "50%",
						right: "auto",
						top: "auto",
						bottom: TOOLBAR_DEFAULT_BOTTOM,
						transform: "translateX(-50%)",
						transition:
							"left 300ms cubic-bezier(0.22,1,0.36,1), transform 300ms cubic-bezier(0.22,1,0.36,1)",
					}
				: toolbarY === null && !isHorizontalEdge
					? {
							...positionStyle,
							top: defaultFloatingToolbarTop,
							bottom: "auto",
						}
					: positionStyle,
			toolbarSide,
		};
	}, [
		elementRef,
		handlePointerCancel,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		isDrawerOpen,
		isHorizontalEdge,
		positionStyle,
		toolbarHeight,
		toolbarSide,
		toolbarY,
	]);
}
