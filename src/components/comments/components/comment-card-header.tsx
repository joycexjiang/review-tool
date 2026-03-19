"use client";

import type { NoteView } from "@/components/inspector/lib/note-view-types";
import { formatCommentDate, getCommentTimeAgo } from "../lib/comment-format";

export default function CommentCardHeader({ note }: { note: NoteView }) {
	const timeLabel = note.relativeTimeLabel ?? getCommentTimeAgo(note.timestamp);
	const dateLabel = formatCommentDate(note.timestamp);
	return (
		<div className="mb-1 flex items-center gap-1.5">
			<span className="text-[12px] font-medium text-zinc-900">
				{note.reviewer.name}
			</span>
			<span
				className="text-xs text-zinc-400"
				suppressHydrationWarning
				title={dateLabel}
			>
				{timeLabel}
			</span>
		</div>
	);
}
