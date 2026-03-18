"use client";

import { useMemo } from "react";
import type { FilterState } from "@/components/inspector/state/types";
import { DEPLOY_ORDER, isDeployAtOrBefore } from "@/mock/deploys";
import type { Note, Severity } from "@/types";

export interface NoteView extends Note {
	/** True if this note was auto-fixed in a later deploy that is at or before activeDeploy */
	isFixedInDeploy: boolean;
	/** True if this note was created in the active deploy (not inherited from a prior deploy) */
	isNew: boolean;
}

/** Filter and enrich notes for the active deploy */
export function useDeployNotes(
	notes: Note[],
	activeDeploy: string,
): NoteView[] {
	return useMemo(() => {
		const isFirstDeploy =
			DEPLOY_ORDER.indexOf(activeDeploy as "v1" | "v2") === 0;

		return notes
			.filter((note) => isDeployAtOrBefore(note.deployVersion, activeDeploy))
			.map((note) => {
				const isFixedInDeploy =
					!!note.fixedInDeploy &&
					isDeployAtOrBefore(note.fixedInDeploy, activeDeploy);

				const effectiveResolved = note.fixedInDeploy
					? isFixedInDeploy
					: note.resolved;

				return {
					...note,
					resolved: effectiveResolved,
					isFixedInDeploy,
					isNew: !isFirstDeploy && note.deployVersion === activeDeploy,
				};
			});
	}, [notes, activeDeploy]);
}

/** Apply type filter to notes */
export function useFilteredNotes(
	notes: NoteView[],
	filters: FilterState,
): NoteView[] {
	return useMemo(() => {
		if (!filters.type) return notes;
		return notes.filter((note) => note.type === filters.type);
	}, [notes, filters]);
}

const SEVERITY_ORDER: Record<Severity, number> = {
	blocking: 0,
	major: 1,
	minor: 2,
};

/** Sort notes by severity (blocking → major → minor), then newest first */
export function useSortedNotes(notes: NoteView[]): NoteView[] {
	return useMemo(() => {
		return [...notes].sort((a, b) => {
			// Unresolved first, resolved last
			if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
			// Then by severity
			const sevDiff =
				SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
			if (sevDiff !== 0) return sevDiff;
			// Then newest first
			return b.timestamp - a.timestamp;
		});
	}, [notes]);
}

/** Stats for the summary bar */
export interface ReviewStats {
	total: number;
	resolved: number;
	unresolved: number;
	blocking: number;
	major: number;
	minor: number;
	fixedInDeploy: number;
	newInDeploy: number;
}

export function useReviewStats(notes: NoteView[]): ReviewStats {
	return useMemo(() => {
		const stats: ReviewStats = {
			total: notes.length,
			resolved: 0,
			unresolved: 0,
			blocking: 0,
			major: 0,
			minor: 0,
			fixedInDeploy: 0,
			newInDeploy: 0,
		};

		for (const note of notes) {
			if (note.resolved) {
				stats.resolved++;
			} else {
				stats.unresolved++;
				switch (note.severity) {
					case "blocking":
						stats.blocking++;
						break;
					case "major":
						stats.major++;
						break;
					case "minor":
						stats.minor++;
						break;
				}
			}
			if (note.isFixedInDeploy) stats.fixedInDeploy++;
			if (note.isNew) stats.newInDeploy++;
		}

		return stats;
	}, [notes]);
}
