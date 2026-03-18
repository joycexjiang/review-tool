"use client";

import {
	isResolvedNote,
	type NoteView,
} from "@/components/inspector/lib/note-view-types";

export interface SeveritySection {
	key: string;
	label: string;
	notes: NoteView[];
}

export function groupNotesBySeveritySection(
	notes: NoteView[],
): SeveritySection[] {
	const unresolved = notes.filter((note) => !isResolvedNote(note));
	const resolved = notes.filter((note) => isResolvedNote(note));
	const sections: SeveritySection[] = [];

	const blocking = unresolved.filter((note) => note.severity === "blocking");
	const major = unresolved.filter((note) => note.severity === "major");
	const minor = unresolved.filter((note) => note.severity === "minor");

	if (blocking.length > 0) {
		sections.push({ key: "blocking", label: "Blocking", notes: blocking });
	}
	if (major.length > 0) {
		sections.push({ key: "major", label: "Major", notes: major });
	}
	if (minor.length > 0) {
		sections.push({ key: "minor", label: "Minor", notes: minor });
	}
	if (resolved.length > 0) {
		sections.push({ key: "resolved", label: "Resolved", notes: resolved });
	}

	return sections;
}
