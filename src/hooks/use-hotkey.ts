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
			if (!(event instanceof KeyboardEvent)) {
				return;
			}

			if (event.key.toLowerCase() !== normalizedKey) {return;}
			if (!matchesModifier(shiftKey, event.shiftKey)) {return;}
			if (!matchesModifier(altKey, event.altKey)) {return;}
			if (!matchesModifier(metaKey, event.metaKey)) {return;}
			if (!matchesModifier(ctrlKey, event.ctrlKey)) {return;}
			if (
				metaOrCtrl !== undefined &&
				(event.metaKey || event.ctrlKey) !== metaOrCtrl
			) {
				return;
			}

			if (preventDefault) {
				event.preventDefault();
			}
			if (stopPropagation) {
				event.stopPropagation();
			}

			handler(event);
		},
		undefined,
		enabled,
	);
}
