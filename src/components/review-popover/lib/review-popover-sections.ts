"use client";

import { COMMENT_SEVERITY_LABELS } from "@/components/comments/lib/comment-format";
import {
	isResolvedNote,
	type NoteView,
} from "@/components/inspector/lib/note-view-types";
import type { Severity } from "@/types";

export interface SeveritySection {
	key: string;
	label: string;
	notes: NoteView[];
}

const SEVERITY_KEYS: Severity[] = ["blocking", "major", "minor"];

export function groupNotesBySeveritySection(
	notes: NoteView[],
): SeveritySection[] {
	const unresolved = notes.filter((note) => !isResolvedNote(note));
	const resolved = notes.filter((note) => isResolvedNote(note));
	const sections: SeveritySection[] = [];

	for (const severity of SEVERITY_KEYS) {
		const group = unresolved.filter((note) => note.severity === severity);
		if (group.length > 0) {
			sections.push({
				key: severity,
				label: COMMENT_SEVERITY_LABELS[severity],
				notes: group,
			});
		}
	}

	if (resolved.length > 0) {
		sections.push({ key: "resolved", label: "Resolved", notes: resolved });
	}

	return sections;
}
