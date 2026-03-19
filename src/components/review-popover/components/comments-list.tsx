"use client";

import type { CSSProperties } from "react";
import { useMemo } from "react";
import TriageCommentCard from "@/components/comments/comment-card";
import { COMMENT_SEVERITY_LABELS } from "@/components/comments/lib/comment-format";
import { cn } from "@/lib/utils";
import type { Severity } from "@/types";
import SeverityIcon from "@/ui/icons/severity";
import {
	useReviewPopoverActions,
	useReviewPopoverData,
} from "../review-popover-context";
import {
	AllResolvedReviewState,
	EmptyReviewState,
	FilteredEmptyReviewState,
} from "./review-popover-empty-states";

function useBadgeNumbers(deployNotes: { id: string; resolved: boolean }[]) {
	return useMemo(() => {
		const map = new Map<string, number>();
		let seq = 1;
		for (const note of deployNotes) {
			if (!note.resolved) {
				map.set(note.id, seq++);
			}
		}
		return map;
	}, [deployNotes]);
}

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

	const badgeNumbers = useBadgeNumbers(deployNotes);
	let itemIndex = 0;

	return (
		<div ref={listRef} className="relative flex-1 overflow-y-auto scroll-py-3 pb-2">
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
										badgeNumber={badgeNumbers.get(note.id) ?? null}
										onToggleResolve={toggleResolve}
										data-focused={isFocused || undefined}
										className={cn(
											"mx-2",
											isFocused ? "ring-2 ring-zinc-300 bg-zinc-50" : "",
										)}
									/>
								</div>
							);
						});

						const isSeverity = section.key !== "resolved";
						const severity = isSeverity ? (section.key as Severity) : null;

						return (
							<section key={section.key}>
								<div className="flex items-center gap-2.5 px-4.5 pt-3 pb-1 mb-2 border-b border-gray-200">
									{severity ? (
										<SeverityIcon
											severity={severity}
											className="size-4 text-zinc-400"
										/>
									) : null}
									<span className="flex items-baseline gap-1.5">
										<span className="text-sm font-medium">
											{severity
												? COMMENT_SEVERITY_LABELS[severity]
												: section.label}
										</span>
										<span className="text-xs tabular-nums text-zinc-400">
											{section.notes.length}
										</span>
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
