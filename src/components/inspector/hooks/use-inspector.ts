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
import {
	isInspectMode,
	isPopoverOpen,
} from "@/components/inspector/state/types";
import { useEventListener } from "@/hooks/use-event-listener";
import { useUnmount } from "@/hooks/use-unmount";

const IGNORED_SELECTORS = [
	"[data-inspector-overlay]",
	"[data-inspector-tooltip]",
	"[data-inspector-popover]",
	"[data-toolbar]",
	"[data-review-popover]",
];

function isInspectorUI(el: HTMLElement): boolean {
	return IGNORED_SELECTORS.some((sel) => el.closest(sel) !== null);
}

function getTargetElement(event: Event): HTMLElement | null {
	return event.target instanceof HTMLElement ? event.target : null;
}

export function useInspector(
	containerRef: React.RefObject<HTMLElement | null>,
) {
	const { inspection } = useInspectorState();
	const { selectElement } = useInspectorActions();
	const { setHoveredElement } = useHoverContext();
	const inspectModeActive = isInspectMode(inspection);
	const hasSelection = isPopoverOpen(inspection);

	const rafRef = useRef<number>(0);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!inspectModeActive || hasSelection) {
				return;
			}

			cancelAnimationFrame(rafRef.current);
			rafRef.current = requestAnimationFrame(() => {
				const target = document.elementFromPoint(e.clientX, e.clientY);
				if (!(target instanceof HTMLElement) || isInspectorUI(target)) {
					setHoveredElement(null);
					return;
				}

				setHoveredElement(target);
			});
		},
		[hasSelection, inspectModeActive, setHoveredElement],
	);

	const handleClick = useCallback(
		(e: MouseEvent) => {
			if (!inspectModeActive) {
				return;
			}

			const target = getTargetElement(e);
			if (!target || isInspectorUI(target)) {
				return;
			}

			e.preventDefault();
			e.stopPropagation();

			selectElement(target);
		},
		[inspectModeActive, selectElement],
	);

	const handleMouseLeave = useCallback(() => {
		if (!inspectModeActive) {
			return;
		}
		setHoveredElement(null);
	}, [inspectModeActive, setHoveredElement]);

	useEventListener(
		() => containerRef.current,
		"mousemove",
		(event) => {
			if (event instanceof MouseEvent) {
				handleMouseMove(event);
			}
		},
		true,
		inspectModeActive,
	);
	useEventListener(
		() => containerRef.current,
		"click",
		(event) => {
			if (event instanceof MouseEvent) {
				handleClick(event);
			}
		},
		true,
		inspectModeActive,
	);
	useEventListener(
		() => containerRef.current,
		"mouseleave",
		() => {
			handleMouseLeave();
		},
		undefined,
		inspectModeActive,
	);
	useUnmount(() => cancelAnimationFrame(rafRef.current));
}

export { getCssSelector, extractTailwindSpacing };
