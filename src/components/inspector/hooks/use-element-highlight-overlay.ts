"use client";

import { useCallback, useRef } from "react";
import { useUnmount } from "@/hooks/use-unmount";

type HighlightVariant = "preview" | "pulse";

interface HighlightOptions {
	variant?: HighlightVariant;
	scrollIntoView?: boolean | ScrollIntoViewOptions;
	autoRemoveMs?: number;
}

const DEFAULT_SCROLL_OPTIONS: ScrollIntoViewOptions = {
	behavior: "smooth",
	block: "center",
};

function resolveElement(target: HTMLElement | string) {
	if (typeof target === "string") {
		const element = document.querySelector(target);
		return element instanceof HTMLElement ? element : null;
	}

	return target;
}

function rectsMatch(a: DOMRect, b: DOMRect) {
	return (
		Math.abs(a.top - b.top) < 0.5 &&
		Math.abs(a.left - b.left) < 0.5 &&
		Math.abs(a.width - b.width) < 0.5 &&
		Math.abs(a.height - b.height) < 0.5
	);
}

function createHighlightNode(
	rect: DOMRect,
	variant: HighlightVariant,
): HTMLDivElement {
	const overlay = document.createElement("div");
	overlay.setAttribute("data-inspector-overlay", "");
	overlay.style.cssText = `
		position: fixed;
		z-index: ${variant === "pulse" ? 9998 : 9996};
		top: ${rect.top}px;
		left: ${rect.left}px;
		width: ${rect.width}px;
		height: ${rect.height}px;
		pointer-events: none;
	`;

	const inner = document.createElement("div");
	inner.style.cssText =
		variant === "pulse"
			? `
				width: 100%;
				height: 100%;
				border: 2px solid #3b82f6;
				background: rgba(59, 130, 246, 0.15);
				border-radius: 2px;
				animation: inspectorPulse 600ms ease-out forwards;
			`
			: `
				width: 100%;
				height: 100%;
				border: 2px solid #3b82f6;
				background: rgba(59, 130, 246, 0.08);
				border-radius: 2px;
				transition: opacity 150ms;
			`;

	overlay.appendChild(inner);
	return overlay;
}

async function waitForStableRect(element: HTMLElement, timeoutMs = 800) {
	return new Promise<DOMRect>((resolve) => {
		let stableFrames = 0;
		let lastRect = element.getBoundingClientRect();
		const start = performance.now();

		const tick = (now: number) => {
			const nextRect = element.getBoundingClientRect();
			stableFrames = rectsMatch(lastRect, nextRect) ? stableFrames + 1 : 0;
			lastRect = nextRect;

			if (stableFrames >= 3 || now - start >= timeoutMs) {
				resolve(nextRect);
				return;
			}

			requestAnimationFrame(tick);
		};

		requestAnimationFrame(tick);
	});
}

export function useElementHighlightOverlay() {
	const overlayRef = useRef<HTMLDivElement | null>(null);
	const removeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const requestIdRef = useRef(0);

	const clearHighlight = useCallback(() => {
		if (removeTimerRef.current) {
			clearTimeout(removeTimerRef.current);
			removeTimerRef.current = null;
		}

		overlayRef.current?.remove();
		overlayRef.current = null;
	}, []);

	useUnmount(clearHighlight);

	const showHighlight = useCallback(
		async (
			target: HTMLElement | string,
			{
				variant = "preview",
				scrollIntoView = false,
				autoRemoveMs,
			}: HighlightOptions = {},
		) => {
			const element = resolveElement(target);
			if (!element) {return null;}

			const currentRequestId = ++requestIdRef.current;

			if (scrollIntoView) {
				element.scrollIntoView(
					scrollIntoView === true ? DEFAULT_SCROLL_OPTIONS : scrollIntoView,
				);
			}

			const rect = scrollIntoView
				? await waitForStableRect(element)
				: element.getBoundingClientRect();

			if (requestIdRef.current !== currentRequestId) {
				return element;
			}

			clearHighlight();
			const overlay = createHighlightNode(rect, variant);
			document.body.appendChild(overlay);
			overlayRef.current = overlay;

			if (autoRemoveMs) {
				removeTimerRef.current = setTimeout(() => {
					if (requestIdRef.current === currentRequestId) {
						clearHighlight();
					}
				}, autoRemoveMs);
			}

			return element;
		},
		[clearHighlight],
	);

	return {
		showHighlight,
		clearHighlight,
	};
}
