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
const SNAP_TRANSITION = "all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)";

interface DragState {
	dragging: boolean;
	startX: number;
	startY: number;
	offsetX: number;
	offsetY: number;
	moved: boolean;
}

interface UseDockedFloatingPositionOptions {
	side: ToolbarSide;
	y: number | null;
	sideOffset?: number;
	defaultTop?: number;
	defaultBottom?: number;
	onSideChange?: (side: ToolbarSide) => void;
	onWidthChange?: (width: number) => void;
	onYChange?: (y: number | null) => void;
	canStartDrag?: (target: HTMLElement) => boolean;
}

function getViewportWidth(): number | null {
	return typeof window === "undefined" ? null : window.innerWidth;
}

function getViewportHeight(): number | null {
	return typeof window === "undefined" ? null : window.innerHeight;
}

function getSnappedLeft(side: ToolbarSide, width: number, sideOffset: number) {
	const viewportWidth = getViewportWidth();
	if (viewportWidth === null) {
		return sideOffset;
	}

	return side === "left" ? sideOffset : viewportWidth - width - sideOffset;
}

function clampY(y: number, height: number) {
	const viewportHeight = getViewportHeight();
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
	y,
	sideOffset = EDGE_MARGIN,
	defaultTop = EDGE_MARGIN,
	defaultBottom,
	onSideChange,
	onWidthChange,
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
		},
		[onWidthChange],
	);

	const handlePointerDown = useCallback<PointerEventHandler<HTMLDivElement>>(
		(e) => {
			const target = e.target as HTMLElement;
			if (canStartDrag && !canStartDrag(target)) return;

			const node = nodeRef.current;
			if (!node) return;

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
			if (!currentDrag?.dragging || !node) return;

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
			const newY = clampY(e.clientY - currentDrag.offsetY, node.offsetHeight);

			setDragXY({ x: newX, y: newY });
			onYChange?.(newY);
		},
		[onYChange],
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
				const centerX = rect.left + rect.width / 2;
				const nextSide: ToolbarSide =
					centerX < window.innerWidth / 2 ? "left" : "right";
				const nextY = clampY(rect.top, node.offsetHeight);

				setIsSnapping(true);
				setDragXY(null);
				setNodeSize({ width: rect.width, height: rect.height });
				onWidthChange?.(rect.width);
				onSideChange?.(nextSide);
				onYChange?.(nextY);
			}

			currentDrag.dragging = false;
			dragState.current = null;
		},
		[onSideChange, onWidthChange, onYChange],
	);

	useEventListener(
		() => window,
		"resize",
		() => {
			const node = nodeRef.current;
			if (!node) return;

			const nextWidth = node.offsetWidth;
			const nextHeight = node.offsetHeight;
			setNodeSize({ width: nextWidth, height: nextHeight });
			onWidthChange?.(nextWidth);

			if (y !== null) {
				onYChange?.(clampY(y, nextHeight));
			}
		},
		undefined,
		true,
	);

	let positionStyle: CSSProperties;

	if (dragXY) {
		positionStyle = {
			left: dragXY.x,
			top: dragXY.y,
			transition: "none",
			cursor: "grabbing",
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
			left: getSnappedLeft(side, nodeSize.width, sideOffset),
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
