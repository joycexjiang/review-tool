"use client";

import {
	isFixedInDeployNote,
	isNewNote,
	type NoteView,
} from "@/components/inspector/lib/note-view-types";
import { cn } from "@/lib/utils";
import { COMMENT_SEVERITY_DOT, getCommentTimeAgo } from "../lib/comment-format";

export default function CommentCardHeader({ note }: { note: NoteView }) {
	return (
		<div className="mb-1 flex items-center gap-1.5">
			<span
				className={cn(
					"size-[6px] shrink-0 rounded-full",
					COMMENT_SEVERITY_DOT[note.severity],
				)}
			/>
			<span className="text-[12px] font-medium text-zinc-900">
				{note.reviewer.name}
			</span>
			<span suppressHydrationWarning className="text-[12px] text-zinc-300">
				{note.relativeTimeLabel ?? getCommentTimeAgo(note.timestamp)}
			</span>
			<div className="flex-1" />
			{isNewNote(note) ? (
				<span className="text-[11px] font-medium text-blue-500">New</span>
			) : null}
			{isFixedInDeployNote(note) ? (
				<span className="text-[11px] text-emerald-500">
					Fixed in {note.status.deploy}
				</span>
			) : null}
		</div>
	);
}
