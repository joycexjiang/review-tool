"use client";

import type { DeployVersion, Note } from "@/types";

export type NoteViewStatus =
	| { type: "open" }
	| { type: "new" }
	| { type: "resolved" }
	| { type: "fixed-in-deploy"; deploy: DeployVersion };

export interface NoteView extends Note {
	status: NoteViewStatus;
}

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

export function isResolvedNote(note: NoteView): boolean {
	return (
		note.status.type === "resolved" || note.status.type === "fixed-in-deploy"
	);
}

export function isNewNote(note: NoteView): boolean {
	return note.status.type === "new";
}

export function isFixedInDeployNote(note: NoteView): note is NoteView & {
	status: { type: "fixed-in-deploy"; deploy: DeployVersion };
} {
	return note.status.type === "fixed-in-deploy";
}
