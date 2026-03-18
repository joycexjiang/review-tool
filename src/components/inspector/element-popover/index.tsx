"use client";

import { useCallback, useId, useRef } from "react";
import {
	useInspectorActions,
	useInspectorState,
} from "@/components/inspector/state/provider";
import {
	getSelectedElement,
	isPopoverOpen,
} from "@/components/inspector/state/types";
import { useClipboardCopy } from "@/hooks/use-clipboard-copy";
import { useResolvedElementInfo } from "@/hooks/use-resolved-source";
import type { CommentType, Note, Severity } from "@/types";
import ElementPopoverContent from "./content";
import {
	useDialogFocusTrap,
	usePopoverLayout,
	usePreviousFocus,
} from "./use-element-popover";

export default function ElementPopover() {
	const { inspection, activeDeploy } = useInspectorState();
	const { closePopover, addNote } = useInspectorActions();
	const selectedElement = getSelectedElement(inspection);
	const popoverOpen = isPopoverOpen(inspection);

	const popoverRef = useRef<HTMLDivElement>(null);
	const titleId = useId();
	const { copied: selectorCopied, copy: copySelectorToClipboard } =
		useClipboardCopy();
	const { copied: sourceCopied, copy: copySourceToClipboard } =
		useClipboardCopy();

	const previousFocusRef = usePreviousFocus(popoverOpen, selectedElement);
	const layout = usePopoverLayout(popoverOpen, selectedElement, popoverRef);
	const elementInfo = useResolvedElementInfo(selectedElement, popoverOpen);

	const restoreFocus = useCallback(() => {
		previousFocusRef.current?.focus({ preventScroll: true });
	}, [previousFocusRef]);

	const handleClose = useCallback(() => {
		closePopover();
		restoreFocus();
	}, [closePopover, restoreFocus]);

	useDialogFocusTrap(popoverOpen, layout !== null, popoverRef, handleClose);

	const handleSubmit = useCallback(
		(text: string, type: CommentType, severity: Severity) => {
			if (!elementInfo) {return;}

			const note: Note = {
				id: `note-${Date.now()}`,
				type,
				severity,
				elementInfo,
				text,
				timestamp: Date.now(),
				resolved: false,
				reviewer: { name: "You" },
				deployVersion: activeDeploy,
				area: "Pricing Card",
			};
			addNote(note);
			handleClose();
		},
		[elementInfo, addNote, handleClose, activeDeploy],
	);

	const cssSelector = elementInfo?.cssSelector ?? "";
	const sourceLocation = elementInfo?.sourceFile
		? `${elementInfo.sourceFile}${elementInfo.sourceLine ? `:${elementInfo.sourceLine}` : ""}`
		: "";

	const handleCopySelector = useCallback(() => {
		if (!cssSelector) {return;}
		void copySelectorToClipboard(cssSelector);
	}, [copySelectorToClipboard, cssSelector]);

	const handleCopySource = useCallback(() => {
		if (!sourceLocation) {return;}
		void copySourceToClipboard(sourceLocation);
	}, [copySourceToClipboard, sourceLocation]);

	if (!popoverOpen || !selectedElement || !elementInfo) {return null;}

	const rect = layout?.highlightRect ?? {
		top: Math.round(elementInfo.boundingRect.top),
		left: Math.round(elementInfo.boundingRect.left),
		width: Math.round(elementInfo.boundingRect.width),
		height: Math.round(elementInfo.boundingRect.height),
	};

	return (
		<ElementPopoverContent
			popoverRef={popoverRef}
			titleId={titleId}
			layout={layout}
			rect={rect}
			elementInfo={elementInfo}
			selectorCopied={selectorCopied}
			onCopySelector={handleCopySelector}
			sourceCopied={sourceCopied}
			onCopySource={handleCopySource}
			onClose={handleClose}
			onSubmit={handleSubmit}
		/>
	);
}
