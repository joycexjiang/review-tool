"use client";

import type { ToolbarSide } from "@/components/inspector/state/types";
import { useDockedFloatingPosition } from "@/hooks/use-docked-floating-position";
import { useViewportSize } from "@/hooks/use-viewport-size";

const EDGE_MARGIN = 12;
const DRAWER_MIN_WIDTH = 320;
const DRAWER_DEFAULT_WIDTH = 420;
const DRAWER_MAX_WIDTH = 720;
const FLOATING_WIDTH = 740;
const FLOATING_HEIGHT = Math.round((FLOATING_WIDTH * 576) / 640);
const TOOLBAR_DEFAULT_HEIGHT = 42;
const TOOLBAR_GAP = 40;
const FOLLOW_TRANSITION =
	"left 500ms cubic-bezier(0.34, 1.56, 0.64, 1), right 500ms cubic-bezier(0.34, 1.56, 0.64, 1)";

function clampFloatingTop(
	top: number | undefined,
	viewportHeight: number | null,
) {
	if (viewportHeight === null || top === undefined) {
		return top;
	}

	const panelHeight = Math.min(
		FLOATING_HEIGHT,
		viewportHeight - EDGE_MARGIN * 2,
	);
	const maxTop = Math.max(
		EDGE_MARGIN,
		viewportHeight - panelHeight - EDGE_MARGIN,
	);

	return Math.max(EDGE_MARGIN, Math.min(maxTop, top));
}

function getFloatingHeight(viewportHeight: number | null) {
	if (viewportHeight === null) {
		return FLOATING_HEIGHT;
	}

	return Math.min(FLOATING_HEIGHT, viewportHeight - EDGE_MARGIN * 2);
}

function getDefaultFloatingTop(
	floatingHeight: number,
	viewportHeight: number | null,
) {
	if (viewportHeight === null) {
		return EDGE_MARGIN;
	}

	return clampFloatingTop(
		viewportHeight / 2 - floatingHeight / 2,
		viewportHeight,
	);
}

interface UseReviewPopoverLayoutOptions {
	panelMode: "floating" | "drawer";
	toolbarSide: ToolbarSide;
	toolbarWidth: number;
	toolbarHeight: number;
	toolbarY: number | null;
	setToolbarSide: (side: ToolbarSide) => void;
	setToolbarY: (y: number | null) => void;
}

export function useReviewPopoverLayout({
	panelMode,
	toolbarSide,
	toolbarWidth,
	toolbarHeight,
	toolbarY,
	setToolbarSide,
	setToolbarY,
}: UseReviewPopoverLayoutOptions) {
	const viewportSize = useViewportSize();
	const viewportHeight = viewportSize?.height ?? null;
	const viewportWidth = viewportSize?.width ?? null;
	const isDrawerMode = panelMode === "drawer";
	const isLeft = toolbarSide === "left";
	const floatingHeight = getFloatingHeight(viewportHeight);
	const resolvedToolbarHeight = toolbarHeight || TOOLBAR_DEFAULT_HEIGHT;
	const panelEdgeOffset = EDGE_MARGIN + toolbarWidth + TOOLBAR_GAP;
	const maxDrawerWidth =
		viewportWidth === null
			? DRAWER_MAX_WIDTH
			: Math.min(
					DRAWER_MAX_WIDTH,
					Math.max(DRAWER_MIN_WIDTH, viewportWidth - 280),
				);

	const {
		elementRef,
		positionStyle,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		handlePointerCancel,
	} = useDockedFloatingPosition({
		side: toolbarSide,
		y:
			toolbarY === null
				? null
				: toolbarY - (floatingHeight - resolvedToolbarHeight) / 2,
		viewportHeight,
		viewportWidth,
		sideOffset: panelEdgeOffset,
		defaultTop: getDefaultFloatingTop(floatingHeight, viewportHeight),
		onSideChange: setToolbarSide,
		onYChange: (nextTop) => {
			setToolbarY(
				nextTop === null
					? null
					: nextTop + (floatingHeight - resolvedToolbarHeight) / 2,
			);
		},
		canStartDrag: (target) =>
			Boolean(target.closest("[data-panel-drag-handle]")) &&
			!target.closest("button"),
	});

	return {
		drawer: {
			defaultWidth: DRAWER_DEFAULT_WIDTH,
			maxWidth: maxDrawerWidth,
			minWidth: DRAWER_MIN_WIDTH,
		},
		edgeMargin: EDGE_MARGIN,
		elementRef,
		floating: {
			followTransition: FOLLOW_TRANSITION,
			height: floatingHeight,
			top:
				typeof positionStyle.top === "number"
					? clampFloatingTop(positionStyle.top, viewportHeight)
					: positionStyle.top,
			width: FLOATING_WIDTH,
		},
		handlePointerCancel,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		isDrawerMode,
		isLeft,
		positionStyle,
		toolbarDefaultHeight: TOOLBAR_DEFAULT_HEIGHT,
	};
}
