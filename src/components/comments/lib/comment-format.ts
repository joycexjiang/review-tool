"use client";

import type { Note, Severity } from "@/types";

export const COMMENT_TYPE_LABELS: Record<string, string> = {
	bug: "Bug",
	suggestion: "Suggestion",
	question: "Question",
};

export const COMMENT_SEVERITY_DOT: Record<Severity, string> = {
	blocking: "bg-red-500",
	major: "bg-amber-400",
	minor: "bg-zinc-300",
};

export function formatCommentMarkdown(note: Note): string {
	const typeLabel = COMMENT_TYPE_LABELS[note.type] ?? note.type;
	const tag = note.elementInfo.tagName.toLowerCase();
	const sourceLabel = note.elementInfo.sourceFile
		? `${note.elementInfo.sourceFile}${note.elementInfo.sourceLine ? `:${note.elementInfo.sourceLine}` : ""}`
		: "—";

	return `**[${typeLabel}]** (${note.severity}) on \`<${tag}>\`
Source: \`${sourceLabel}\`
Selector: \`${note.elementInfo.cssSelector}\`

> ${note.text}`;
}

export function getCommentTimeAgo(timestamp: number): string {
	const diff = Date.now() - timestamp;
	const minutes = Math.floor(diff / 60000);
	if (minutes < 1) {return "just now";}
	if (minutes < 60) {return `${minutes}m ago`;}
	const hours = Math.floor(minutes / 60);
	if (hours < 24) {return `${hours}h ago`;}
	return `${Math.floor(hours / 24)}d ago`;
}
