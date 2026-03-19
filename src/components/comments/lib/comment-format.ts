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

export const COMMENT_SEVERITY_COLOR: Record<Severity, string> = {
	blocking: "text-red-600",
	major: "text-amber-600",
	minor: "text-zinc-500",
};

export const COMMENT_SEVERITY_LABELS: Record<Severity, string> = {
	blocking: "Blocking",
	major: "Major",
	minor: "Minor",
};

export function getCommentSourceLabel(info: {
	sourceFile?: string;
	sourceLine?: number;
	cssSelector?: string;
}): string {
	if (info.sourceFile) {
		return `${info.sourceFile}${info.sourceLine ? `:${info.sourceLine}` : ""}`;
	}
	return info.cssSelector ?? "—";
}

export function formatCommentDate(timestamp: number): string {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(new Date(timestamp));
}

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
	if (minutes < 1) {
		return "just now";
	}
	if (minutes < 60) {
		return `${minutes}m ago`;
	}
	const hours = Math.floor(minutes / 60);
	if (hours < 24) {
		return `${hours}h ago`;
	}
	return `${Math.floor(hours / 24)}d ago`;
}
