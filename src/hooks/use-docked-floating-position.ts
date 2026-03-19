"use client";

import {
	type CSSProperties,
	type PointerEventHandler,
	useCallback,
	useRef,
	useState,
} from "react";
import type { ToolbarSide } from "@/components/inspector/state/types";
import { useEventListener } from "@/hooks/use-event-listener";

const EDGE_MARGIN = 12;
const DRAG_THRESHOLD = 3;
const SNAP_TRANSITION = "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)";

interface DragState {
	dragging: boolean;
	startX: number;
	startY: number;
	offsetX: number;
	offsetY: number;
	moved: boolean;
}

const ALL_SIDES: ToolbarSide[] = ["left", "right", "top", "bottom"];

interface UseDockedFloatingPositionOptions {
	side: ToolbarSide;
	x?: number | null;
	y: number | null;
	viewportHeight?: number | null;
	viewportWidth?: number | null;
	sideOffset?: number;
	defaultTop?: number;
	defaultBottom?: number;
	allowedSides?: ToolbarSide[];
	onSideChange?: (side: ToolbarSide) => void;
	onWidthChange?: (width: number) => void;
	onHeightChange?: (height: number) => void;
	onXChange?: (x: number | null) => void;
	onYChange?: (y: number | null) => void;
	canStartDrag?: (target: HTMLElement) => boolean;
}

function clampX(x: number, width: number, viewportWidth: number | null) {
	if (viewportWidth === null) {
		return EDGE_MARGIN;
	}

	return Math.max(
		EDGE_MARGIN,
		Math.min(viewportWidth - width - EDGE_MARGIN, x),
	);
}

function getSnappedLeft(
	side: ToolbarSide,
	width: number,
	sideOffset: number,
	viewportWidth: number | null,
	x: number | null,
) {
	if (viewportWidth === null) {
		return sideOffset;
	}

	if (side === "top" || side === "bottom") {
		if (x !== null) {
			return clampX(x, width, viewportWidth);
		}

		return Math.max(sideOffset, (viewportWidth - width) / 2);
	}

	return side === "left" ? sideOffset : viewportWidth - width - sideOffset;
}

function getSnappedTop(
	side: ToolbarSide,
	height: number,
	sideOffset: number,
	viewportHeight: number | null,
) {
	if (side !== "top" && side !== "bottom") {
		return undefined;
	}

	if (viewportHeight === null) {
		return sideOffset;
	}

	return side === "top" ? sideOffset : viewportHeight - height - sideOffset;
}

function getNearestSide(
	rect: DOMRect,
	allowedSides: ToolbarSide[],
): ToolbarSide {
	const centerX = rect.left + rect.width / 2;
	const centerY = rect.top + rect.height / 2;
	const vw = window.innerWidth;
	const vh = window.innerHeight;

	const distances: [ToolbarSide, number][] = [
		["left", centerX],
		["right", vw - centerX],
		["top", centerY],
		["bottom", vh - centerY],
	];

	let nearest: ToolbarSide = allowedSides[0];
	let minDist = Number.POSITIVE_INFINITY;

	for (const [side, dist] of distances) {
		if (allowedSides.includes(side) && dist < minDist) {
			minDist = dist;
			nearest = side;
		}
	}

	return nearest;
}

function clampY(y: number, height: number, viewportHeight: number | null) {
	if (viewportHeight === null) {
		return EDGE_MARGIN;
	}

	return Math.max(
		EDGE_MARGIN,
		Math.min(viewportHeight - height - EDGE_MARGIN, y),
	);
}

export function useDockedFloatingPosition({
	side,
	x = null,
	y,
	viewportHeight = null,
	viewportWidth = null,
	sideOffset = EDGE_MARGIN,
	defaultTop = EDGE_MARGIN,
	defaultBottom,
	allowedSides = ALL_SIDES,
	onSideChange,
	onWidthChange,
	onHeightChange,
	onXChange,
	onYChange,
	canStartDrag,
}: UseDockedFloatingPositionOptions) {
	const nodeRef = useRef<HTMLDivElement | null>(null);
	const dragState = useRef<DragState | null>(null);
	const [dragXY, setDragXY] = useState<{ x: number; y: number } | null>(null);
	const [isSnapping, setIsSnapping] = useState(false);
	const [nodeSize, setNodeSize] = useState({ width: 0, height: 0 });

	const elementRef = useCallback(
		(node: HTMLDivElement | null) => {
			nodeRef.current = node;
			const nextWidth = node?.offsetWidth ?? 0;
			const nextHeight = node?.offsetHeight ?? 0;
			setNodeSize({ width: nextWidth, height: nextHeight });
			onWidthChange?.(nextWidth);
			onHeightChange?.(nextHeight);
		},
		[onHeightChange, onWidthChange],
	);

	const handlePointerDown = useCallback<PointerEventHandler<HTMLDivElement>>(
		(e) => {
			if (!(e.target instanceof HTMLElement)) {
				return;
			}

			const target = e.target;
			if (canStartDrag && !canStartDrag(target)) {
				return;
			}

			const node = nodeRef.current;
			if (!node) {
				return;
			}

			node.setPointerCapture(e.pointerId);
			setIsSnapping(false);

			const rect = node.getBoundingClientRect();
			dragState.current = {
				dragging: true,
				startX: e.clientX,
				startY: e.clientY,
				offsetX: e.clientX - rect.left,
				offsetY: e.clientY - rect.top,
				moved: false,
			};
		},
		[canStartDrag],
	);

	const handlePointerMove = useCallback<PointerEventHandler<HTMLDivElement>>(
		(e) => {
			const currentDrag = dragState.current;
			const node = nodeRef.current;
			if (!currentDrag?.dragging || !node) {
				return;
			}

			const deltaX = e.clientX - currentDrag.startX;
			const deltaY = e.clientY - currentDrag.startY;
			if (
				!currentDrag.moved &&
				Math.abs(deltaX) < DRAG_THRESHOLD &&
				Math.abs(deltaY) < DRAG_THRESHOLD
			) {
				return;
			}

			currentDrag.moved = true;

			const newX = e.clientX - currentDrag.offsetX;
			const newY = clampY(
				e.clientY - currentDrag.offsetY,
				node.offsetHeight,
				viewportHeight,
			);

			setDragXY({ x: newX, y: newY });
			onYChange?.(newY);
		},
		[onYChange, viewportHeight],
	);

	const handlePointerEnd = useCallback<PointerEventHandler<HTMLDivElement>>(
		(e) => {
			const node = nodeRef.current;
			if (node?.hasPointerCapture(e.pointerId)) {
				node.releasePointerCapture(e.pointerId);
			}

			const currentDrag = dragState.current;
			if (!currentDrag || !node) {
				dragState.current = null;
				return;
			}

			if (currentDrag.moved) {
				const rect = node.getBoundingClientRect();
				const nextSide = getNearestSide(rect, allowedSides);
				const isHorizontalEdge =
					nextSide === "top" || nextSide === "bottom";
				const nextX = isHorizontalEdge
					? clampX(rect.left, node.offsetWidth, viewportWidth)
					: null;
				const nextY = isHorizontalEdge
					? null
					: clampY(rect.top, node.offsetHeight, viewportHeight);

				setIsSnapping(true);
				setDragXY(null);
				setNodeSize({ width: rect.width, height: rect.height });
				onWidthChange?.(rect.width);
				onHeightChange?.(rect.height);
				onSideChange?.(nextSide);
				onXChange?.(nextX);
				onYChange?.(nextY);
			}

			currentDrag.dragging = false;
			dragState.current = null;
		},
		[
			allowedSides,
			onHeightChange,
			onSideChange,
			onWidthChange,
			onXChange,
			onYChange,
			viewportHeight,
			viewportWidth,
		],
	);

	useEventListener(
		() => window,
		"resize",
		() => {
			const node = nodeRef.current;
			if (!node) {
				return;
			}

			const nextWidth = node.offsetWidth;
			const nextHeight = node.offsetHeight;
			setNodeSize({ width: nextWidth, height: nextHeight });
			onWidthChange?.(nextWidth);
			onHeightChange?.(nextHeight);

			if (x !== null) {
				onXChange?.(clampX(x, nextWidth, window.innerWidth));
			}

			if (y !== null) {
				onYChange?.(clampY(y, nextHeight, window.innerHeight));
			}
		},
		undefined,
		true,
	);

	const isHorizontalEdge = side === "top" || side === "bottom";
	let positionStyle: CSSProperties;

	if (dragXY) {
		positionStyle = {
			left: dragXY.x,
			top: dragXY.y,
			transition: "none",
			cursor: "grabbing",
		};
	} else if (isHorizontalEdge) {
		const snappedTop = getSnappedTop(
			side,
			nodeSize.height,
			sideOffset,
			viewportHeight,
		);
		positionStyle = {
			left: getSnappedLeft(
				side,
				nodeSize.width,
				sideOffset,
				viewportWidth,
				x,
			),
			top: snappedTop,
			transition: isSnapping ? SNAP_TRANSITION : "none",
		};
	} else if (y === null) {
		positionStyle = {
			...(side === "left" ? { left: sideOffset } : { right: sideOffset }),
			...(defaultBottom !== undefined
				? { bottom: defaultBottom }
				: { top: defaultTop }),
			transition: isSnapping ? SNAP_TRANSITION : "none",
		};
	} else {
		positionStyle = {
			left: getSnappedLeft(side, nodeSize.width, sideOffset, viewportWidth, x),
			top: y,
			transition: isSnapping ? SNAP_TRANSITION : "none",
		};
	}

	return {
		elementRef,
		positionStyle,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp: handlePointerEnd,
		handlePointerCancel: handlePointerEnd,
	};
}
