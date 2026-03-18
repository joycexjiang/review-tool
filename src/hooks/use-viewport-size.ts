"use client";

import { useSyncExternalStore } from "react";

interface ViewportSize {
	width: number;
	height: number;
}

let cachedViewportSize: ViewportSize | null = null;

function subscribe(onStoreChange: () => void) {
	window.addEventListener("resize", onStoreChange);

	return () => {
		window.removeEventListener("resize", onStoreChange);
	};
}

function getSnapshot(): ViewportSize {
	const nextWidth = window.innerWidth;
	const nextHeight = window.innerHeight;

	if (
		cachedViewportSize &&
		cachedViewportSize.width === nextWidth &&
		cachedViewportSize.height === nextHeight
	) {
		return cachedViewportSize;
	}

	cachedViewportSize = {
		width: nextWidth,
		height: nextHeight,
	};

	return cachedViewportSize;
}

function getServerSnapshot(): null {
	return null;
}

export function useViewportSize(): ViewportSize | null {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
