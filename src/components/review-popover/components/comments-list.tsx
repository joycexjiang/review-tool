"use client";

import type { CSSProperties } from "react";
import TriageCommentCard from "@/components/comments/comment-card";
import {
	useReviewPopoverActions,
	useReviewPopoverData,
} from "../review-popover-context";
import {
	AllResolvedReviewState,
	EmptyReviewState,
	FilteredEmptyReviewState,
} from "./review-popover-empty-states";

export default function ReviewPopoverList() {
	const { toggleResolve } = useReviewPopoverActions();
	const {
		deployNotes,
		focusedIndex,
		isFilteredEmpty,
		listRef,
		sections,
		stats,
	} = useReviewPopoverData();

	let itemIndex = 0;

	return (
		<div ref={listRef} className="relative flex-1 overflow-y-auto px-2 pb-2">
			{deployNotes.length === 0 ? (
				<EmptyReviewState />
			) : isFilteredEmpty ? (
				<FilteredEmptyReviewState />
			) : stats.total > 0 && stats.unresolved === 0 ? (
				<AllResolvedReviewState total={stats.total} />
			) : (
				<div className="space-y-1">
					{sections.map((section) => {
						const sectionItems = section.notes.map((note) => {
							const idx = itemIndex++;
							const isFocused = idx === focusedIndex;
							const itemStyle: CSSProperties & { "--item-index": number } = {
								"--item-index": idx,
							};

							return (
								<div
									key={note.id}
									className="animate-panel-item-in"
									style={itemStyle}
								>
									<TriageCommentCard
										note={note}
										onToggleResolve={toggleResolve}
										data-focused={isFocused || undefined}
										className={
											isFocused ? "ring-2 ring-zinc-900/10 bg-zinc-50" : ""
										}
									/>
								</div>
							);
						});

						return (
							<section key={section.key}>
								<div className="px-3 pt-3 pb-1">
									<span className="text-[11px] font-medium text-zinc-400">
										{section.label}
									</span>
								</div>
								{sectionItems}
							</section>
						);
					})}
				</div>
			)}
		</div>
	);
}
