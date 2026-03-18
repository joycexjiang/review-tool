"use client";

import { useCallback, useRef } from "react";
import { useHoverContext } from "@/components/inspector/element-hover/hover-context";
import {
	extractTailwindSpacing,
	getCssSelector,
} from "@/components/inspector/lib/dom-utils";
import {
	useInspectorActions,
	useInspectorState,
} from "@/components/inspector/state/provider";
import { useEventListener } from "@/hooks/use-event-listener";
import { useUnmount } from "@/hooks/use-unmount";

const IGNORED_SELECTORS = [
	"[data-inspector-overlay]",
	"[data-inspector-tooltip]",
	"[data-inspector-popover]",
	"[data-toolbar]",
	"[data-side-panel]",
];

function isInspectorUI(el: HTMLElement): boolean {
	return IGNORED_SELECTORS.some((sel) => el.closest(sel) !== null);
}

export function useInspector(
	containerRef: React.RefObject<HTMLElement | null>,
) {
	const { inspectMode, popoverOpen } = useInspectorState();
	const { selectElement } = useInspectorActions();
	const { setHoveredElement } = useHoverContext();

	const rafRef = useRef<number>(0);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!inspectMode || popoverOpen) return;

			cancelAnimationFrame(rafRef.current);
			rafRef.current = requestAnimationFrame(() => {
				const target = document.elementFromPoint(
					e.clientX,
					e.clientY,
				) as HTMLElement | null;
				if (!target || isInspectorUI(target)) {
					setHoveredElement(null);
					return;
				}
				setHoveredElement(target);
			});
		},
		[inspectMode, popoverOpen, setHoveredElement],
	);

	const handleClick = useCallback(
		(e: MouseEvent) => {
			if (!inspectMode) return;

			const target = e.target as HTMLElement;
			if (isInspectorUI(target)) return;

			e.preventDefault();
			e.stopPropagation();

			selectElement(target);
		},
		[inspectMode, selectElement],
	);

	const handleMouseLeave = useCallback(() => {
		if (!inspectMode) return;
		setHoveredElement(null);
	}, [inspectMode, setHoveredElement]);

	useEventListener(
		() => containerRef.current,
		"mousemove",
		(event) => {
			handleMouseMove(event as MouseEvent);
		},
		true,
		inspectMode,
	);
	useEventListener(
		() => containerRef.current,
		"click",
		(event) => {
			handleClick(event as MouseEvent);
		},
		true,
		inspectMode,
	);
	useEventListener(
		() => containerRef.current,
		"mouseleave",
		() => {
			handleMouseLeave();
		},
		undefined,
		inspectMode,
	);
	useUnmount(() => cancelAnimationFrame(rafRef.current));
}

export { getCssSelector, extractTailwindSpacing };
