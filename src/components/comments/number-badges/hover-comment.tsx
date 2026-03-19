"use client";

import { useCallback } from "react";
import {
	CommentSeverityBadge,
	CommentSourceCode,
} from "@/components/comments/comment-meta";
import { useElementHighlightOverlay } from "@/components/inspector/hooks/use-element-highlight-overlay";
import { useInspectorActions } from "@/components/inspector/state/provider";
import { cn } from "@/lib/utils";
import type { CommentType } from "@/types";
import { NUMBER_BADGE_CLASS } from "@/ui/number-badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import type { BadgeEntry } from "./types";

const TYPE_LABELS = {
	bug: "Bug",
	suggestion: "Suggestion",
	question: "Question",
} satisfies Record<CommentType, string>;

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
							"pointer-events-auto cursor-pointer transition-[transform,background-color,color,opacity] duration-150 hover:scale-105",
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
			>
				<article className="w-80 max-w-[calc(100vw-1rem)] rounded-xl bg-white px-3.5 py-3 border border-inset border-zinc-200 shadow-sm">
					<div className="mb-2 flex items-start gap-2">
						<div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
							<span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ring-1 ring-inset">
								{TYPE_LABELS[entry.note.type]}
							</span>
							<CommentSeverityBadge
								severity={entry.note.severity}
								className="text-zinc-600"
								iconClassName="size-4"
							/>
						</div>
					</div>

					<div className="mb-2 flex items-center justify-between gap-3">
						<span className="truncate text-[12px] font-medium text-zinc-900">
							{entry.note.reviewer.name}
						</span>
						<span
							suppressHydrationWarning
							className="shrink-0 text-[11px] text-zinc-500"
						>
							{entry.note.relativeTimeLabel}
						</span>
					</div>

					<p className="text-[13px] leading-relaxed text-zinc-700">
						{entry.note.text}
					</p>

					<CommentSourceCode
						source={entry.note.elementInfo}
						className="w-full px-2 py-1 text-zinc-600"
					/>
				</article>
			</PopoverContent>
		</Popover>
	);
}
