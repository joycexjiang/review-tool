"use client";

export interface HighlightRect {
	top: number;
	left: number;
	width: number;
	height: number;
}

export interface PopoverLayout {
	target: HTMLElement;
	top: number;
	left: number;
	highlightRect: HighlightRect;
}

const FOCUSABLE_SELECTOR =
	'a[href], button:not(:disabled), textarea:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])';

export const POPOVER_OFFSET = 12;
const VIEWPORT_PADDING = 8;

export function getFocusableElements(container: HTMLElement) {
	return Array.from(
		container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
	);
}

export function getPopoverPosition(anchorRect: DOMRect, popoverRect: DOMRect) {
	const maxLeft = Math.max(
		VIEWPORT_PADDING,
		window.innerWidth - popoverRect.width - VIEWPORT_PADDING,
	);
	const maxTop = Math.max(
		VIEWPORT_PADDING,
		window.innerHeight - popoverRect.height - VIEWPORT_PADDING,
	);

	let top = anchorRect.top;
	let left = anchorRect.right + POPOVER_OFFSET;

	if (left > maxLeft) {
		left = anchorRect.left - popoverRect.width - POPOVER_OFFSET;
	}

	if (left < VIEWPORT_PADDING) {
		left = Math.min(Math.max(anchorRect.left, VIEWPORT_PADDING), maxLeft);
		top = anchorRect.bottom + POPOVER_OFFSET;
	}

	if (top > maxTop) {
		top = maxTop;
	}

	return {
		top: Math.round(top),
		left: Math.round(left),
		highlightRect: {
			top: Math.round(anchorRect.top),
			left: Math.round(anchorRect.left),
			width: Math.round(anchorRect.width),
			height: Math.round(anchorRect.height),
		},
	};
}

export function isSameLayout(
	current: PopoverLayout | null,
	next: PopoverLayout,
) {
	return (
		current?.target === next.target &&
		current.top === next.top &&
		current.left === next.left &&
		current.highlightRect.top === next.highlightRect.top &&
		current.highlightRect.left === next.highlightRect.left &&
		current.highlightRect.width === next.highlightRect.width &&
		current.highlightRect.height === next.highlightRect.height
	);
}
