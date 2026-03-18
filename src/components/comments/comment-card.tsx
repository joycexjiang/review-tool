"use client";

import { type ComponentPropsWithoutRef, useCallback, useState } from "react";
import { useInspectorActions } from "@/components/inspector/state/provider";
import { useClipboardCopy } from "@/hooks/use-clipboard-copy";
import { useElementHighlightOverlay } from "@/hooks/use-element-highlight-overlay";
import type { NoteView } from "@/hooks/use-filtered-notes";
import { cn } from "@/lib/utils";
import type { Note, Severity } from "@/types";
import CheckIcon from "@/ui/icons/check";
import CopyIcon from "@/ui/icons/copy";
import XMarkIcon from "@/ui/icons/x-mark";
import { toast } from "@/ui/toaster";

const TYPE_LABELS: Record<string, string> = {
	bug: "Bug",
	suggestion: "Suggestion",
	question: "Question",
};

const SEVERITY_DOT: Record<Severity, string> = {
	blocking: "bg-red-500",
	major: "bg-amber-400",
	minor: "bg-zinc-300",
};

interface TriageCommentCardProps extends ComponentPropsWithoutRef<"article"> {
	note: NoteView;
	onToggleResolve: (id: string) => void;
}

export default function TriageCommentCard({
	note,
	onToggleResolve,
	className,
	...props
}: TriageCommentCardProps) {
	const { setActiveNote } = useInspectorActions();
	const { showHighlight, clearHighlight } = useElementHighlightOverlay();
	const { copied, copy: copyToClipboard } = useClipboardCopy({
		onSuccess: () => toast.success("Copied as Markdown"),
	});
	const [isExpanded, setIsExpanded] = useState(!note.resolved);

	const handleMouseEnter = useCallback(() => {
		setActiveNote(note.id);
		void showHighlight(note.elementInfo.cssSelector, {
			variant: "preview",
		});
	}, [note.id, note.elementInfo.cssSelector, setActiveNote, showHighlight]);

	const handleMouseLeave = useCallback(() => {
		setActiveNote(null);
		clearHighlight();
	}, [clearHighlight, setActiveNote]);

	const handleCopy = useCallback(() => {
		void copyToClipboard(formatCommentMarkdown(note));
	}, [copyToClipboard, note]);

	// Resolved collapsed state — single clean row
	if (note.resolved && !isExpanded) {
		return (
			<article
				data-note-id={note.id}
				className={cn(
					"group flex items-center gap-2.5 rounded-[10px] px-3 py-2 transition-colors duration-150 hover:bg-zinc-50",
					className,
				)}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				{...props}
			>
				<CheckIcon className="size-3.5 shrink-0 text-emerald-400" />
				<p className="min-w-0 flex-1 truncate text-[13px] text-zinc-400 line-through decoration-zinc-300">
					{note.text}
				</p>
				{note.isFixedInDeploy && (
					<span className="shrink-0 text-[11px] text-zinc-400">
						{note.fixedInDeploy}
					</span>
				)}
				<button
					type="button"
					onClick={() => setIsExpanded(true)}
					className="shrink-0 text-[11px] text-zinc-400 opacity-0 transition-opacity duration-150 hover:text-zinc-600 group-hover:opacity-100"
					aria-label="Expand resolved comment"
				>
					Show
				</button>
			</article>
		);
	}

	// Expanded / unresolved state — list item style
	return (
		<article
			data-note-id={note.id}
			aria-label={`${TYPE_LABELS[note.type]} by ${note.reviewer.name}`}
			className={cn(
				"group rounded-[10px] px-3 py-2.5 transition-colors duration-150",
				note.resolved
					? "opacity-50"
					: "hover:bg-zinc-50",
				className,
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			{...props}
		>
			{/* Meta row */}
			<div className="mb-1 flex items-center gap-1.5">
				<span className={cn("size-[6px] shrink-0 rounded-full", SEVERITY_DOT[note.severity])} />
				<span className="text-[12px] font-medium text-zinc-900">
					{note.reviewer.name}
				</span>
				<span suppressHydrationWarning className="text-[12px] text-zinc-300">
					{note.relativeTimeLabel ?? getTimeAgo(note.timestamp)}
				</span>
				<div className="flex-1" />
				{note.isNew && (
					<span className="text-[11px] font-medium text-blue-500">
						New
					</span>
				)}
				{note.isFixedInDeploy && (
					<span className="text-[11px] text-emerald-500">
						Fixed in {note.fixedInDeploy}
					</span>
				)}
			</div>

			{/* Comment text */}
			<p
				className={cn(
					"pl-[14px] text-[13px] leading-[1.55] text-zinc-500",
					note.resolved && "line-through text-zinc-400",
				)}
				style={{ textWrap: "pretty" }}
			>
				{note.text}
			</p>

			{/* Actions — appear on hover, subtle */}
			<div className="mt-1.5 flex items-center gap-1 pl-[14px] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
				<button
					type="button"
					onClick={handleCopy}
					className="flex size-6 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
					aria-label="Copy as Markdown"
				>
					{copied ? (
						<CheckIcon className="size-3" />
					) : (
						<CopyIcon className="size-3" />
					)}
				</button>
				<button
					type="button"
					onClick={() => onToggleResolve(note.id)}
					className="flex size-6 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
					aria-label={note.resolved ? "Mark unresolved" : "Resolve"}
				>
					{note.resolved ? (
						<XMarkIcon className="size-3" />
					) : (
						<CheckIcon className="size-3" />
					)}
				</button>
			</div>
		</article>
	);
}

export function formatCommentMarkdown(note: Note): string {
	const typeLabel = TYPE_LABELS[note.type] ?? note.type;
	const tag = note.elementInfo.tagName.toLowerCase();
	const sourceLabel = note.elementInfo.sourceFile
		? `${note.elementInfo.sourceFile}${note.elementInfo.sourceLine ? `:${note.elementInfo.sourceLine}` : ""}`
		: "—";

	return `**[${typeLabel}]** (${note.severity}) on \`<${tag}>\`
Source: \`${sourceLabel}\`
Selector: \`${note.elementInfo.cssSelector}\`

> ${note.text}`;
}

function getTimeAgo(timestamp: number): string {
	const diff = Date.now() - timestamp;
	const minutes = Math.floor(diff / 60000);
	if (minutes < 1) return "just now";
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	return `${Math.floor(hours / 24)}d ago`;
}

export { TriageCommentCard as PanelCommentCard };
