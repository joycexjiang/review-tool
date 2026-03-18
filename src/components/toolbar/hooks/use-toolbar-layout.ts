"use client";

import { useMemo } from "react";
import type { ToolbarSide } from "@/components/inspector/state/types";
import { useDockedFloatingPosition } from "@/hooks/use-docked-floating-position";
import { useViewportSize } from "@/hooks/use-viewport-size";
import type { ToolbarLayoutValue } from "../toolbar-context";

const REVIEW_POPOVER_EDGE_MARGIN = 12;
const TOOLBAR_DEFAULT_BOTTOM = 20;
const TOOLBAR_DEFAULT_HEIGHT = 42;
const REVIEW_POPOVER_FLOATING_HEIGHT = Math.round((420 * 576) / 640);

function getFloatingPanelHeight(viewportHeight: number | null) {
	if (viewportHeight === null) {
		return REVIEW_POPOVER_FLOATING_HEIGHT;
	}

	return Math.min(
		REVIEW_POPOVER_FLOATING_HEIGHT,
		viewportHeight - REVIEW_POPOVER_EDGE_MARGIN * 2,
	);
}

function getDefaultFloatingPanelTop(
	floatingPanelHeight: number,
	viewportHeight: number | null,
) {
	if (viewportHeight === null) {
		return REVIEW_POPOVER_EDGE_MARGIN;
	}

	return Math.max(
		REVIEW_POPOVER_EDGE_MARGIN,
		Math.min(
			viewportHeight - floatingPanelHeight - REVIEW_POPOVER_EDGE_MARGIN,
			viewportHeight / 2 - floatingPanelHeight / 2,
		),
	);
}

interface UseToolbarLayoutOptions {
	panelMode: "floating" | "drawer";
	panelOpen: boolean;
	toolbarHeight: number;
	toolbarSide: ToolbarSide;
	toolbarY: number | null;
	setToolbarHeight: (height: number) => void;
	setToolbarSide: (side: ToolbarSide) => void;
	setToolbarWidth: (width: number) => void;
	setToolbarY: (y: number | null) => void;
}

export function useToolbarLayout({
	panelMode,
	panelOpen,
	toolbarHeight,
	toolbarSide,
	toolbarY,
	setToolbarHeight,
	setToolbarSide,
	setToolbarWidth,
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
		y: toolbarY,
		viewportHeight,
		viewportWidth,
		defaultBottom: TOOLBAR_DEFAULT_BOTTOM,
		onHeightChange: setToolbarHeight,
		onSideChange: setToolbarSide,
		onWidthChange: setToolbarWidth,
		onYChange: setToolbarY,
		canStartDrag: (target) => !target.closest("button"),
	});

	return useMemo(() => {
		const resolvedToolbarHeight = toolbarHeight || TOOLBAR_DEFAULT_HEIGHT;
		const floatingPanelHeight = getFloatingPanelHeight(viewportHeight);
		const defaultFloatingToolbarTop =
			getDefaultFloatingPanelTop(floatingPanelHeight, viewportHeight) +
			(floatingPanelHeight - resolvedToolbarHeight) / 2;

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
				: toolbarY === null
					? {
							...positionStyle,
							top: defaultFloatingToolbarTop,
							bottom: "auto",
						}
					: positionStyle,
		};
	}, [
		elementRef,
		handlePointerCancel,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		isDrawerOpen,
		positionStyle,
		toolbarHeight,
		toolbarY,
		viewportHeight,
	]);
}
