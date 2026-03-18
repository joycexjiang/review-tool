"use client";

import { useHotkey } from "@/hooks/use-hotkey";

function isEditableTarget(target: EventTarget | null) {
	if (!(target instanceof HTMLElement)) {return false;}
	return (
		target instanceof HTMLInputElement ||
		target instanceof HTMLTextAreaElement ||
		target.isContentEditable ||
		target.closest('[contenteditable="true"]') !== null
	);
}

export function useInspectorHotkeys({
	toggleInspectMode,
	togglePanel,
}: {
	toggleInspectMode: () => void;
	togglePanel: () => void;
}) {
	useHotkey(
		{
			key: "i",
			metaOrCtrl: true,
			preventDefault: false,
		},
		(event) => {
			if (isEditableTarget(event.target)) {
				return;
			}

			toggleInspectMode();
		},
	);

	useHotkey(
		{
			key: "c",
			shiftKey: false,
			metaOrCtrl: true,
			preventDefault: false,
		},
		(event) => {
			const selection = window.getSelection()?.toString().trim();
			if (selection || isEditableTarget(event.target)) {
				return;
			}

			event.preventDefault();
			togglePanel();
		},
	);
}
