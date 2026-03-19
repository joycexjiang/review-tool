"use client";

import type { ToolbarSide } from "@/components/inspector/state/types";
import { useDockedFloatingPosition } from "@/hooks/use-docked-floating-position";
import { useViewportSize } from "@/hooks/use-viewport-size";

const EDGE_MARGIN = 12;
const DRAWER_MIN_WIDTH = 320;
const DRAWER_DEFAULT_WIDTH = 420;
const DRAWER_MAX_WIDTH = 720;
const FLOATING_WIDTH = 440;
const FLOATING_HEIGHT = 740;
const TOOLBAR_DEFAULT_HEIGHT = 42;
const TOOLBAR_GAP = 4;
const FOLLOW_TRANSITION =
	"left 300ms cubic-bezier(0.22, 1, 0.36, 1), right 300ms cubic-bezier(0.22, 1, 0.36, 1), top 300ms cubic-bezier(0.22, 1, 0.36, 1)";

function getDefaultFloatingTopCss(floatingHeight: number): string {
	return `max(${EDGE_MARGIN}px, calc(50vh - ${floatingHeight / 2}px))`;
}

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

function getFloatingHeight(
	viewportHeight: number | null,
	reservedTop?: number,
) {
	if (viewportHeight === null) {
		return FLOATING_HEIGHT;
	}

	const topSpace = reservedTop ?? EDGE_MARGIN;
	return Math.min(FLOATING_HEIGHT, viewportHeight - topSpace - EDGE_MARGIN);
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
	toolbarX: number | null;
	toolbarY: number | null;
	setToolbarSide: (side: ToolbarSide) => void;
	setToolbarX: (x: number | null) => void;
	setToolbarY: (y: number | null) => void;
}

export function useReviewPopoverLayout({
	panelMode,
	toolbarSide,
	toolbarWidth,
	toolbarHeight,
	toolbarX,
	toolbarY,
	setToolbarSide,
	setToolbarX,
	setToolbarY,
}: UseReviewPopoverLayoutOptions) {
	const viewportSize = useViewportSize();
	const viewportHeight = viewportSize?.height ?? null;
	const viewportWidth = viewportSize?.width ?? null;
	const isDrawerMode = panelMode === "drawer";
	const isHorizontalEdge = toolbarSide === "top" || toolbarSide === "bottom";
	const resolvedToolbarHeight = toolbarHeight || TOOLBAR_DEFAULT_HEIGHT;
	const panelEdgeOffset = isHorizontalEdge
		? EDGE_MARGIN + resolvedToolbarHeight + TOOLBAR_GAP
		: EDGE_MARGIN + toolbarWidth + TOOLBAR_GAP;
	const floatingHeight = getFloatingHeight(
		viewportHeight,
		isHorizontalEdge ? panelEdgeOffset : EDGE_MARGIN,
	);
	const maxDrawerWidth =
		viewportWidth === null
			? DRAWER_MAX_WIDTH
			: Math.min(
					DRAWER_MAX_WIDTH,
					Math.max(DRAWER_MIN_WIDTH, viewportWidth - 280),
				);

	const popoverX =
		isHorizontalEdge && toolbarX !== null
			? toolbarX - (FLOATING_WIDTH - toolbarWidth) / 2
			: null;

	const popoverY =
		!isHorizontalEdge && toolbarY !== null
			? toolbarY - (floatingHeight - resolvedToolbarHeight) / 2
			: null;

	const {
		elementRef,
		positionStyle,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		handlePointerCancel,
	} = useDockedFloatingPosition({
		side: toolbarSide,
		x: popoverX,
		y: popoverY,
		viewportHeight,
		viewportWidth,
		sideOffset: panelEdgeOffset,
		defaultTop: isHorizontalEdge
			? undefined
			: getDefaultFloatingTop(floatingHeight, viewportHeight),
		allowedSides: ["left", "right", "top", "bottom"],
		onSideChange: setToolbarSide,
		onXChange: (nextX) => {
			setToolbarX(
				nextX === null ? null : nextX + (FLOATING_WIDTH - toolbarWidth) / 2,
			);
		},
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

	const floatingTop = isHorizontalEdge
		? positionStyle.top
		: toolbarY === null
			? getDefaultFloatingTopCss(floatingHeight)
			: typeof positionStyle.top === "number"
				? clampFloatingTop(positionStyle.top, viewportHeight)
				: positionStyle.top;

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
			top: floatingTop,
			width: FLOATING_WIDTH,
		},
		handlePointerCancel,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		isDrawerMode,
		panelSide: toolbarSide,
		positionStyle,
	};
}
