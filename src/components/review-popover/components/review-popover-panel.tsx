"use client";

import type { ToolbarSide } from "@/components/inspector/state/types";
import { cn } from "@/lib/utils";
import {
	useReviewPopoverData,
	useReviewPopoverLayoutContext,
} from "../review-popover-context";
import ReviewPopoverList from "./comments-list";
import DeployTabs from "./deploy-tabs";
import FixWithMenu from "./fix-with";
import TypeFilter from "./grouping-controls";
import ReviewPopoverHeader from "./header";
import HighlightedNoteScroller from "./highlighted-note-scroller";
import ProgressBar from "./progress-ring";

const ORIGIN_CLASS: Record<ToolbarSide, string> = {
	left: "origin-left",
	right: "origin-right",
	top: "origin-top",
	bottom: "origin-bottom",
};

export default function ReviewPopoverPanel() {
	const { deployNotes, fixPrompt, highlightedNoteId, listRef, stats } =
		useReviewPopoverData();
	const { edgeMargin, floatingHeight, isDrawerMode, panelSide, panelOpen } =
		useReviewPopoverLayoutContext();

	return (
		<aside
			aria-label="Review feedback panel"
			className={cn(
				"relative flex w-full flex-col bg-white overflow-hidden will-change-[transform,opacity]",
				isDrawerMode
					? "h-screen border-l border-zinc-200 origin-top-right transition-opacity"
					: "rounded-2xl border border-gray-200 shadow-[inset_0_0_0_1px_white,0_1px_2px_rgb(17_24_39/0.05),0_4px_12px_rgb(17_24_39/0.04),0_16px_40px_rgb(17_24_39/0.06)] outline-none transition-[scale,opacity]",
				!isDrawerMode && ORIGIN_CLASS[panelSide],
				panelOpen || isDrawerMode ? "scale-100" : "scale-[0.96]",
				panelOpen
					? "opacity-100 duration-220 ease-[cubic-bezier(0.23,1,0.32,1)]"
					: "opacity-0 duration-140 ease-[cubic-bezier(0.55,0,1,0.45)]",
			)}
			style={
				isDrawerMode
					? undefined
					: {
							height: `min(${floatingHeight}px, calc(100vh - ${edgeMargin * 2}px))`,
						}
			}
		>
			<div className="flex h-full min-h-0 flex-col">
				{panelOpen && highlightedNoteId ? (
					<HighlightedNoteScroller
						key={highlightedNoteId}
						highlightedNoteId={highlightedNoteId}
						listRef={listRef}
					/>
				) : null}

				<ReviewPopoverHeader />

				<div className="flex items-center justify-between px-4 py-3">
					<TypeFilter deployNotes={deployNotes} />
					<DeployTabs />
				</div>

				<ReviewPopoverList />

				<div
					className={
						isDrawerMode ? "h-px bg-slate-50" : "border-t border-gray-200"
					}
				/>
				{/* footer */}
				<div className="space-y-1 px-2 py-2">
					<ProgressBar resolved={stats.resolved} total={stats.total} />
					<div className="flex items-center justify-between pl-2">
						<span
							className={cn(
								"truncate text-xs tabular-nums",
								stats.total > 0 && stats.unresolved === 0
									? "text-emerald-600"
									: "text-zinc-400",
							)}
						>
							{stats.total > 0 && stats.unresolved === 0
								? "All resolved"
								: `${stats.unresolved} unresolved`}
						</span>
						<FixWithMenu prompt={fixPrompt} />
					</div>
				</div>
			</div>
		</aside>
	);
}
