"use client";

import { useCallback, useRef, useState } from "react";
import { useUnmount } from "@/hooks/use-unmount";

interface UseClipboardCopyOptions {
	resetAfterMs?: number;
	onSuccess?: () => void;
	onError?: () => void;
}

export function useClipboardCopy({
	resetAfterMs = 1500,
	onSuccess,
	onError,
}: UseClipboardCopyOptions = {}) {
	const [copied, setCopied] = useState(false);
	const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearResetTimer = useCallback(() => {
		if (resetTimerRef.current) {
			clearTimeout(resetTimerRef.current);
			resetTimerRef.current = null;
		}
	}, []);

	useUnmount(clearResetTimer);

	const copy = useCallback(
		async (value: string) => {
			if (!value) {return false;}

			try {
				await navigator.clipboard.writeText(value);
				setCopied(true);
				clearResetTimer();
				resetTimerRef.current = setTimeout(() => {
					setCopied(false);
					resetTimerRef.current = null;
				}, resetAfterMs);
				onSuccess?.();
				return true;
			} catch {
				onError?.();
				return false;
			}
		},
		[clearResetTimer, onError, onSuccess, resetAfterMs],
	);

	return { copied, copy };
}
