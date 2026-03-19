"use client";

import { useCallback } from "react";
import { CommentSourceCode } from "@/components/comments/comment-meta";
import {
	COMMENT_SEVERITY_LABELS,
	COMMENT_TYPE_DOT,
	COMMENT_TYPE_LABELS,
} from "@/components/comments/lib/comment-format";
import { useElementHighlightOverlay } from "@/components/inspector/hooks/use-element-highlight-overlay";
import { useInspectorActions } from "@/components/inspector/state/provider";
import { cn } from "@/lib/utils";
import SeverityIcon from "@/ui/icons/severity";
import { NUMBER_BADGE_CLASS } from "@/ui/number-badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import type { BadgeEntry } from "./types";

export default function NumberBadgeHoverComment({
	entry,
	isActive,
	isMuted,
	onBadgeClick,
}: {
	entry: BadgeEntry;
	isActive: boolean;
	isMuted: boolean;
	onBadgeClick: () => void;
}) {
	const { setActiveNote } = useInspectorActions();
	const { showHighlight, clearHighlight } = useElementHighlightOverlay();

	const handleOpenChange = useCallback(
		(open: boolean) => {
			setActiveNote(open ? entry.id : null);
			if (open) {
				void showHighlight(entry.note.elementInfo.cssSelector, {
					variant: "preview",
				});
				return;
			}

			clearHighlight();
		},
		[
			clearHighlight,
			entry.id,
			entry.note.elementInfo.cssSelector,
			setActiveNote,
			showHighlight,
		],
	);

	return (
		<Popover onOpenChange={handleOpenChange}>
			<PopoverTrigger
				openOnHover
				delay={120}
				closeDelay={160}
				render={
					<button
						type="button"
						className={cn(
							NUMBER_BADGE_CLASS,
							"pointer-events-auto cursor-pointer transition-[transform,background-color,color,opacity] duration-150 hover:scale-105 active:scale-95",
							isActive ? "scale-105" : "",
							isMuted ? "bg-zinc-200! text-white shadow-none" : "",
						)}
						onClick={onBadgeClick}
						aria-label={`Open comment ${entry.index + 1}`}
					>
						{entry.index + 1}
					</button>
				}
			/>
			<PopoverContent
				side="right"
				align="center"
				sideOffset={12}
				initialFocus={false}
				finalFocus={false}
				className="drop-shadow-sm"
			>
				<article className="w-80 rounded-xl border border-zinc-200 bg-white p-3.5">
					<div className="mb-2.5 flex flex-wrap items-center gap-1.5">
						<span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700">
							<span
								className={`size-1.5 shrink-0 rounded-full ${COMMENT_TYPE_DOT[entry.note.type]}`}
								aria-hidden
							/>
							{COMMENT_TYPE_LABELS[entry.note.type]}
						</span>
						<span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700">
							<SeverityIcon
								severity={entry.note.severity}
								className="size-3.5 shrink-0"
							/>
							{COMMENT_SEVERITY_LABELS[entry.note.severity]}
						</span>
					</div>

					<div className="mb-1 flex items-center gap-1.5">
						<span className="text-[12px] font-medium text-zinc-900">
							{entry.note.reviewer.name}
						</span>
						<span
							suppressHydrationWarning
							className="text-xs text-zinc-400"
							title={entry.note.relativeTimeLabel}
						>
							{entry.note.relativeTimeLabel}
						</span>
					</div>

					<p className="text-[13px] leading-[1.55] text-zinc-700">
						{entry.note.text}
					</p>

					<CommentSourceCode
						source={entry.note.elementInfo}
						className="mt-2 w-full px-2 py-1 text-zinc-600"
					/>
				</article>
			</PopoverContent>
		</Popover>
	);
}
