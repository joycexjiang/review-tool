"use client";

import { useEventListener } from "@/hooks/use-event-listener";

interface UseHotkeyOptions {
	key: string;
	enabled?: boolean;
	preventDefault?: boolean;
	stopPropagation?: boolean;
	shiftKey?: boolean;
	altKey?: boolean;
	metaKey?: boolean;
	ctrlKey?: boolean;
	metaOrCtrl?: boolean;
}

function matchesModifier(expected: boolean | undefined, actual: boolean) {
	return expected === undefined || expected === actual;
}

export function useHotkey(
	{
		key,
		enabled = true,
		preventDefault = false,
		stopPropagation = false,
		shiftKey,
		altKey,
		metaKey,
		ctrlKey,
		metaOrCtrl,
	}: UseHotkeyOptions,
	handler: (event: KeyboardEvent) => void,
) {
	const normalizedKey = key.toLowerCase();

	useEventListener(
		() => window,
		"keydown",
		(event) => {
			const keyboardEvent = event as KeyboardEvent;
			if (keyboardEvent.key.toLowerCase() !== normalizedKey) return;
			if (!matchesModifier(shiftKey, keyboardEvent.shiftKey)) return;
			if (!matchesModifier(altKey, keyboardEvent.altKey)) return;
			if (!matchesModifier(metaKey, keyboardEvent.metaKey)) return;
			if (!matchesModifier(ctrlKey, keyboardEvent.ctrlKey)) return;
			if (
				metaOrCtrl !== undefined &&
				(keyboardEvent.metaKey || keyboardEvent.ctrlKey) !== metaOrCtrl
			) {
				return;
			}

			if (preventDefault) {
				keyboardEvent.preventDefault();
			}
			if (stopPropagation) {
				keyboardEvent.stopPropagation();
			}

			handler(keyboardEvent);
		},
		undefined,
		enabled,
	);
}
