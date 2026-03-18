"use client";

import type { Note } from "@/types";
import type { BadgeEntry, BadgePosition } from "./types";

const BADGE_OFFSET = 8;

export function resolveBadgeEntries(notes: Note[]): BadgeEntry[] {
	if (typeof document === "undefined") {
		return [];
	}

	const entries: BadgeEntry[] = [];
	let sequentialIndex = 0;

	for (const note of notes) {
		if (note.resolved) {
			continue;
		}

		const targetEl = document.querySelector(
			note.elementInfo.cssSelector,
		) as HTMLElement | null;

		if (!targetEl) {
			sequentialIndex++;
			continue;
		}

		entries.push({
			id: note.id,
			index: sequentialIndex,
			note,
			targetEl,
		});
		sequentialIndex++;
	}

	return entries;
}

export function computeBadgePositions(entries: BadgeEntry[]) {
	const nextPositions = new Map<string, BadgePosition>();

	for (const entry of entries) {
		const rect = entry.targetEl.getBoundingClientRect();
		nextPositions.set(entry.id, {
			top: rect.top - BADGE_OFFSET,
			left: rect.right - BADGE_OFFSET,
		});
	}

	return nextPositions;
}
