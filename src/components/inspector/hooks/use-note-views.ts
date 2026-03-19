"use client";

import { useMemo } from "react";
import type {
	NoteView,
	NoteViewStatus,
	ReviewStats,
} from "@/components/inspector/lib/note-view-types";
import {
	isFixedInDeployNote,
	isResolvedNote,
} from "@/components/inspector/lib/note-view-types";
import type { FilterState } from "@/components/inspector/state/types";
import { DEPLOY_ORDER, isDeployAtOrBefore } from "@/mock/deploys";
import type { DeployVersion, Note, Severity } from "@/types";

export function useDeployNotes(
	notes: Note[],
	activeDeploy: DeployVersion,
): NoteView[] {
	return useMemo(() => {
		const isFirstDeploy = activeDeploy === DEPLOY_ORDER[0];

		return notes
			.filter((note) => isDeployAtOrBefore(note.deployVersion, activeDeploy))
			.map((note) => {
				let status: NoteViewStatus;
				if (
					note.fixedInDeploy &&
					isDeployAtOrBefore(note.fixedInDeploy, activeDeploy)
				) {
					status = {
						type: "fixed-in-deploy",
						deploy: note.fixedInDeploy,
					};
				} else if (!isFirstDeploy && note.deployVersion === activeDeploy) {
					status = { type: "new" };
				} else if (note.resolved) {
					status = { type: "resolved" };
				} else {
					status = { type: "open" };
				}

				return {
					...note,
					resolved: isResolvedNote({ ...note, status }),
					status,
				};
			});
	}, [notes, activeDeploy]);
}

export function useFilteredNotes(
	notes: NoteView[],
	filters: FilterState,
): NoteView[] {
	return useMemo(() => {
		if (!filters.type) {
			return notes;
		}
		return notes.filter((note) => note.type === filters.type);
	}, [notes, filters]);
}

const SEVERITY_ORDER: Record<Severity, number> = {
	blocking: 0,
	major: 1,
	minor: 2,
};

export function useSortedNotes(notes: NoteView[]): NoteView[] {
	return useMemo(() => {
		return [...notes].sort((a, b) => {
			const aResolved = isResolvedNote(a);
			const bResolved = isResolvedNote(b);
			if (aResolved !== bResolved) {
				return aResolved ? 1 : -1;
			}

			const severityDiff =
				SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
			if (severityDiff !== 0) {
				return severityDiff;
			}

			return b.timestamp - a.timestamp;
		});
	}, [notes]);
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
		};

		for (const note of notes) {
			if (isResolvedNote(note)) {
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

			if (isFixedInDeployNote(note)) {
				stats.fixedInDeploy++;
			}
		}

		return stats;
	}, [notes]);
}
