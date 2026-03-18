"use client";

import {
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	getFocusableElements,
	getPopoverPosition,
	isSameLayout,
	type PopoverLayout,
} from "@/components/inspector/lib/popover-layout";

export function usePreviousFocus(
	popoverOpen: boolean,
	selectedElement: HTMLElement | null,
) {
	const previousFocusRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!popoverOpen || !selectedElement) {return;}
		previousFocusRef.current =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;
	}, [popoverOpen, selectedElement]);

	return previousFocusRef;
}

export function usePopoverLayout(
	popoverOpen: boolean,
	selectedElement: HTMLElement | null,
	popoverRef: RefObject<HTMLDivElement | null>,
) {
	const [layout, setLayout] = useState<PopoverLayout | null>(null);

	const measure = useCallback(() => {
		const popover = popoverRef.current;
		if (!popover || !selectedElement) {return;}

		const nextLayout: PopoverLayout = {
			target: selectedElement,
			...getPopoverPosition(
				selectedElement.getBoundingClientRect(),
				popover.getBoundingClientRect(),
			),
		};

		setLayout((current) =>
			isSameLayout(current, nextLayout) ? current : nextLayout,
		);
	}, [popoverRef, selectedElement]);

	useEffect(() => {
		if (!popoverOpen || !selectedElement) {return;}

		let frame = requestAnimationFrame(measure);
		const scheduleMeasure = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(measure);
		};

		const observer = new ResizeObserver(scheduleMeasure);
		observer.observe(selectedElement);
		if (popoverRef.current) {
			observer.observe(popoverRef.current);
		}

		window.addEventListener("resize", scheduleMeasure);
		document.addEventListener("scroll", scheduleMeasure, true);

		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			window.removeEventListener("resize", scheduleMeasure);
			document.removeEventListener("scroll", scheduleMeasure, true);
		};
	}, [measure, popoverOpen, popoverRef, selectedElement]);

	return layout?.target === selectedElement ? layout : null;
}

export function useDialogFocusTrap(
	popoverOpen: boolean,
	layoutReady: boolean,
	popoverRef: RefObject<HTMLDivElement | null>,
	onClose: () => void,
) {
	useEffect(() => {
		if (!popoverOpen || !layoutReady) {return;}

		const popover = popoverRef.current;
		if (!popover) {return;}

		const focusables = getFocusableElements(popover);
		if (focusables.length > 0) {
			focusables[0].focus({ preventScroll: true });
		} else {
			popover.focus({ preventScroll: true });
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				event.stopPropagation();
				onClose();
				return;
			}

			if (event.key !== "Tab") {return;}

			const currentFocusables = getFocusableElements(popover);
			if (currentFocusables.length === 0) {return;}

			const first = currentFocusables[0];
			const last = currentFocusables[currentFocusables.length - 1];

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus({ preventScroll: true });
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus({ preventScroll: true });
			}
		};

		popover.addEventListener("keydown", handleKeyDown);
		return () => popover.removeEventListener("keydown", handleKeyDown);
	}, [layoutReady, onClose, popoverOpen, popoverRef]);
}
