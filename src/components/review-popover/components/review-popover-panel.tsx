"use client";

import {
	useReviewPopoverActions,
	useReviewPopoverData,
	useReviewPopoverLayoutContext,
} from "../review-popover-context";
import ReviewPopoverList from "./comments-list";
import TypeFilter from "./grouping-controls";
import ReviewPopoverHeader from "./header";
import HighlightedNoteScroller from "./highlighted-note-scroller";

export default function ReviewPopoverPanel() {
	const { clearHighlightedNote } = useReviewPopoverActions();
	const { deployNotes, highlightedNoteId, listRef, unresolvedCount } =
		useReviewPopoverData();
	const { edgeMargin, floatingHeight, isDrawerMode, isLeft, panelOpen } =
		useReviewPopoverLayoutContext();

	return (
		<aside
			aria-label="Review feedback"
			className={
				isDrawerMode
					? "flex h-screen w-full flex-col border-l border-zinc-200 bg-white"
					: "ui-glass-panel flex w-full flex-col rounded-2xl"
			}
			style={{
				backgroundColor: isDrawerMode ? undefined : "rgb(255 255 255)",
				height: isDrawerMode
					? "100vh"
					: `min(${floatingHeight}px, calc(100vh - ${edgeMargin * 2}px))`,
				opacity: panelOpen ? 1 : 0,
				transformOrigin: isDrawerMode
					? "right top"
					: isLeft
						? "left center"
						: "right center",
				transform: panelOpen || isDrawerMode ? "scale(1)" : "scale(0.985)",
				willChange: "transform, opacity",
				transition: isDrawerMode
					? `opacity ${panelOpen ? "220ms" : "140ms"} cubic-bezier(0.23, 1, 0.32, 1)`
					: `transform ${panelOpen ? "220ms" : "140ms"} cubic-bezier(0.23, 1, 0.32, 1), opacity ${
							panelOpen ? "220ms" : "140ms"
						} cubic-bezier(0.23, 1, 0.32, 1), backdrop-filter 300ms cubic-bezier(0.165, 0.84, 0.44, 1), background-color 300ms cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 300ms cubic-bezier(0.165, 0.84, 0.44, 1)`,
			}}
		>
			{panelOpen && highlightedNoteId ? (
				<HighlightedNoteScroller
					key={highlightedNoteId}
					highlightedNoteId={highlightedNoteId}
					listRef={listRef}
					onClear={clearHighlightedNote}
				/>
			) : null}

			<ReviewPopoverHeader />

			<div className="px-5 py-3">
				<TypeFilter deployNotes={deployNotes} />
			</div>

			<ReviewPopoverList />

			<div
				className={
					isDrawerMode ? "h-px bg-zinc-200" : "ui-glass-panel-separator mx-5"
				}
			/>
			<div className="flex items-center justify-between px-5 py-3.5">
				<span className="text-[11px] text-zinc-400">
					{unresolvedCount} unresolved
					<span className="ml-2 text-zinc-300">↑↓ navigate · ↵ copy</span>
				</span>
			</div>
		</aside>
	);
}
