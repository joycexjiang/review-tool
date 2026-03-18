"use client";

import {
	isFixedInDeployNote,
	type NoteView,
} from "@/components/inspector/lib/note-view-types";
import { cn } from "@/lib/utils";
import CheckIcon from "@/ui/icons/check";

export default function ResolvedCommentRow({
	className,
	note,
	onExpand,
	onMouseEnter,
	onMouseLeave,
	...props
}: React.ComponentPropsWithoutRef<"article"> & {
	note: NoteView;
	onExpand: () => void;
}) {
	return (
		<article
			data-note-id={note.id}
			className={cn(
				"group flex items-center gap-2.5 rounded-[10px] px-3 py-2 transition-colors duration-150 hover:bg-zinc-50",
				className,
			)}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			{...props}
		>
			<CheckIcon className="size-3.5 shrink-0 text-emerald-400" />
			<p className="min-w-0 flex-1 truncate text-[13px] text-zinc-400 line-through decoration-zinc-300">
				{note.text}
			</p>
			{isFixedInDeployNote(note) ? (
				<span className="shrink-0 text-[11px] text-zinc-400">
					{note.status.deploy}
				</span>
			) : null}
			<button
				type="button"
				onClick={onExpand}
				className="shrink-0 text-[11px] text-zinc-400 opacity-0 transition-opacity duration-150 hover:text-zinc-600 group-hover:opacity-100"
				aria-label="Expand resolved comment"
			>
				Show
			</button>
		</article>
	);
}
