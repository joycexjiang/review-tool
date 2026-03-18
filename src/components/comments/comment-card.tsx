"use client";

import { type ComponentPropsWithoutRef, useState } from "react";
import type { NoteView } from "@/components/inspector/lib/note-view-types";
import { cn } from "@/lib/utils";
import CommentCardActions from "./components/comment-card-actions";
import CommentCardHeader from "./components/comment-card-header";
import ResolvedCommentRow from "./components/resolved-comment-row";
import { useCommentCardInteractions } from "./hooks/use-comment-card-interactions";
import { COMMENT_TYPE_LABELS } from "./lib/comment-format";

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
	const { copied, handleCopy, handleMouseEnter, handleMouseLeave } =
		useCommentCardInteractions(note);
	const [isExpanded, setIsExpanded] = useState(!note.resolved);

	if (note.resolved && !isExpanded) {
		return (
			<ResolvedCommentRow
				note={note}
				className={className}
				onExpand={() => setIsExpanded(true)}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				{...props}
			/>
		);
	}

	return (
		<article
			data-note-id={note.id}
			aria-label={`${COMMENT_TYPE_LABELS[note.type]} by ${note.reviewer.name}`}
			className={cn(
				"group rounded-[10px] px-3 py-2.5 transition-colors duration-150",
				note.resolved ? "opacity-50" : "hover:bg-zinc-50",
				className,
			)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			{...props}
		>
			<CommentCardHeader note={note} />
			<p
				className={cn(
					"pl-[14px] text-[13px] leading-[1.55] text-zinc-500",
					note.resolved && "line-through text-zinc-400",
				)}
				style={{ textWrap: "pretty" }}
			>
				{note.text}
			</p>
			<CommentCardActions
				copied={copied}
				noteId={note.id}
				resolved={note.resolved}
				onCopy={handleCopy}
				onToggleResolve={onToggleResolve}
			/>
		</article>
	);
}

export { TriageCommentCard as PanelCommentCard };
export { formatCommentMarkdown } from "./lib/comment-format";
