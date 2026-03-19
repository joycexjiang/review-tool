"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PanelMode } from "@/components/inspector/state/types";
import { useEventListener } from "@/hooks/use-event-listener";
import type { Note } from "@/types";
import type { BadgePosition } from "./types";
import { computeBadgePositions, resolveBadgeEntries } from "./utils";

const PANEL_TRANSITION_MS = 320;
const EMPTY_POSITIONS = new Map<string, BadgePosition>();

export function useNumberBadges(
	notes: Note[],
	panelOpen: boolean,
	panelMode: PanelMode,
	drawerWidth: number,
) {
	const entries = useMemo(() => resolveBadgeEntries(notes), [notes]);
	const layoutTransitionKey = `${panelOpen}:${panelMode}:${drawerWidth}`;
	const [positions, setPositions] = useState<Map<string, BadgePosition>>(
		new Map(),
	);
	const observerRef = useRef<ResizeObserver | null>(null);
	const rafRef = useRef<number>(0);

	const updatePositions = useCallback(() => {
		setPositions(computeBadgePositions(entries));
	}, [entries]);

	useEventListener(
		() => window,
		"resize",
		updatePositions,
		undefined,
		entries.length > 0,
	);
	useEventListener(
		() => document,
		"scroll",
		updatePositions,
		{ capture: true, passive: true },
		entries.length > 0,
	);

	useEffect(() => {
		if (entries.length === 0) {return;}

		// Re-run the measurement loop when the review UI changes layout.
		const shouldAnimateLayout = layoutTransitionKey.length > 0;
		const animationStart = performance.now();
		const animationEnd =
			animationStart + (shouldAnimateLayout ? PANEL_TRANSITION_MS : 0);
		const animate = (now: number) => {
			updatePositions();
			if (now < animationEnd) {
				rafRef.current = requestAnimationFrame(animate);
			}
		};
		rafRef.current = requestAnimationFrame(animate);

		observerRef.current?.disconnect();
		observerRef.current = new ResizeObserver(updatePositions);
		for (const entry of entries) {
			observerRef.current.observe(entry.targetEl);
		}

		return () => {
			cancelAnimationFrame(rafRef.current);
			observerRef.current?.disconnect();
		};
	}, [entries, layoutTransitionKey, updatePositions]);

	return {
		entries,
		positions: entries.length === 0 ? EMPTY_POSITIONS : positions,
	};
}
