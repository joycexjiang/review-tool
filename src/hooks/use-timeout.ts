"use client";

import { useEffect, useEffectEvent } from "react";

/**
 * Timer lifecycle helper for mount-bound UX work.
 * Prefer event handlers when the timer is caused by a user interaction.
 */
export function useTimeout(
	callback: () => void,
	delayMs: number | null,
	enabled = true,
) {
	const onTimeout = useEffectEvent(callback);

	useEffect(() => {
		if (!enabled || delayMs === null) return;

		const timeout = setTimeout(() => {
			onTimeout();
		}, delayMs);

		return () => clearTimeout(timeout);
	}, [delayMs, enabled]);
}
