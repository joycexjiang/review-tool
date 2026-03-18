"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import TriageCommentCard, {
	formatCommentMarkdown,
} from "@/components/comments/comment-card";
import {
	useInspectorActions,
	useInspectorState,
} from "@/components/inspector/state/provider";
import { useClipboardCopy } from "@/hooks/use-clipboard-copy";
import { useDockedFloatingPosition } from "@/hooks/use-docked-floating-position";
import {
	type NoteView,
	useDeployNotes,
	useFilteredNotes,
	useReviewStats,
	useSortedNotes,
} from "@/hooks/use-filtered-notes";
import { useHotkey } from "@/hooks/use-hotkey";
import { useTimeout } from "@/hooks/use-timeout";
import { useUnmount } from "@/hooks/use-unmount";
import CheckIcon from "@/ui/icons/check";
import CopyIcon from "@/ui/icons/copy";
import XMarkIcon from "@/ui/icons/x-mark";
import { toast } from "@/ui/toaster";
import DeployTabs from "./deploy-tabs";
import FixWithMenu from "./fix-with";
import TypeFilter from "./grouping-controls";
import SummaryBar from "./summary-bar";

const TOOLBAR_EDGE_MARGIN = 12;
const PANEL_TOOLBAR_GAP = 40;
const PANEL_WIDTH = 420;
const PANEL_HEIGHT_OFFSET = 154;
const PANEL_VIEWPORT_MARGIN = 12;

// ─── Helpers ────────────────────────────────────────────────

interface SeveritySection {
	key: string;
	label: string;
	notes: NoteView[];
}

function groupBySeveritySection(notes: NoteView[]): SeveritySection[] {
	const unresolved = notes.filter((n) => !n.resolved);
	const resolved = notes.filter((n) => n.resolved);

	const sections: SeveritySection[] = [];

	const blocking = unresolved.filter((n) => n.severity === "blocking");
	const major = unresolved.filter((n) => n.severity === "major");
	const minor = unresolved.filter((n) => n.severity === "minor");

	if (blocking.length > 0)
		sections.push({ key: "blocking", label: "Blocking", notes: blocking });
	if (major.length > 0)
		sections.push({ key: "major", label: "Major", notes: major });
	if (minor.length > 0)
		sections.push({ key: "minor", label: "Minor", notes: minor });
	if (resolved.length > 0)
		sections.push({ key: "resolved", label: "Resolved", notes: resolved });

	return sections;
}

function clampPanelTop(top: number | undefined) {
	if (typeof window === "undefined" || top === undefined) {
		return top;
	}

	const panelHeight =
		window.innerHeight - (PANEL_VIEWPORT_MARGIN * 2 + PANEL_HEIGHT_OFFSET);
	const maxTop = Math.max(
		PANEL_VIEWPORT_MARGIN,
		window.innerHeight - panelHeight - PANEL_VIEWPORT_MARGIN,
	);

	return Math.max(PANEL_VIEWPORT_MARGIN, Math.min(maxTop, top));
}

// ─── Highlighted note scroller ──────────────────────────────

function HighlightedNoteScroller({
	highlightedNoteId,
	listRef,
	onClear,
}: {
	highlightedNoteId: string;
	listRef: React.RefObject<HTMLDivElement | null>;
	onClear: () => void;
}) {
	const highlightedCardRef = useRef<HTMLElement | null>(null);

	useTimeout(() => {
		const card = listRef.current?.querySelector(
			`[data-note-id="${highlightedNoteId}"]`,
		);
		if (!(card instanceof HTMLElement)) return;

		highlightedCardRef.current = card;
		card.scrollIntoView({ behavior: "smooth", block: "center" });
		card.style.boxShadow = "0 0 0 2px var(--color-review-accent)";
	}, 250);

	useTimeout(() => {
		const card = highlightedCardRef.current;
		if (!card) return;

		card.style.boxShadow = "";
		highlightedCardRef.current = null;
		onClear();
	}, 1750);

	useUnmount(() => {
		highlightedCardRef.current?.style.setProperty("box-shadow", "");
	});

	return null;
}

// ─── Keyboard navigation hook ───────────────────────────────

function useKeyboardNav(
	listRef: React.RefObject<HTMLDivElement | null>,
	panelOpen: boolean,
	sortedNotes: NoteView[],
	resetKey: string,
) {
	const [focusState, setFocusState] = useState({
		focusedIndex: -1,
		resetKey,
	});
	const focusedIndex =
		focusState.resetKey === resetKey ? focusState.focusedIndex : -1;

	const scrollToIndex = useCallback(
		(index: number) => {
			const card = listRef.current?.querySelectorAll("[data-note-id]")[index];
			if (card instanceof HTMLElement) {
				card.scrollIntoView({ behavior: "smooth", block: "nearest" });
			}
		},
		[listRef],
	);

	useHotkey(
		{ key: "ArrowDown", enabled: panelOpen, preventDefault: true },
		() => {
			setFocusState((prev) => {
				const currentIndex =
					prev.resetKey === resetKey ? prev.focusedIndex : -1;
				const next = Math.min(currentIndex + 1, sortedNotes.length - 1);
				scrollToIndex(next);
				return { focusedIndex: next, resetKey };
			});
		},
	);

	useHotkey(
		{ key: "ArrowUp", enabled: panelOpen, preventDefault: true },
		() => {
			setFocusState((prev) => {
				const currentIndex =
					prev.resetKey === resetKey ? prev.focusedIndex : -1;
				const next = Math.max(currentIndex - 1, 0);
				scrollToIndex(next);
				return { focusedIndex: next, resetKey };
			});
		},
	);

	useHotkey(
		{
			key: "Enter",
			enabled: panelOpen && focusedIndex >= 0,
			preventDefault: true,
		},
		() => {
			const note = sortedNotes[focusedIndex];
			if (note) {
				navigator.clipboard
					.writeText(formatCommentMarkdown(note))
					.then(() => toast.success("Copied comment as Markdown"));
			}
		},
	);

	return focusedIndex;
}

// ─── Main panel ─────────────────────────────────────────────

export default function SidePanel() {
	const {
		panelOpen,
		notes,
		popoverOpen,
		highlightedNoteId,
		activeDeploy,
		filters,
		toolbarSide,
		toolbarWidth,
		toolbarY,
	} = useInspectorState();
	const {
		announce,
		clearHighlightedNote,
		togglePanel,
		toggleResolve,
		setToolbarSide,
		setToolbarY,
	} = useInspectorActions();
	const listRef = useRef<HTMLDivElement>(null);

	const deployNotes = useDeployNotes(notes, activeDeploy);
	const filteredNotes = useFilteredNotes(deployNotes, filters);
	const sortedNotes = useSortedNotes(filteredNotes);
	const stats = useReviewStats(deployNotes);
	const sections = useMemo(
		() => groupBySeveritySection(sortedNotes),
		[sortedNotes],
	);
	const keyboardNavResetKey = `${activeDeploy}:${filters.type ?? "all"}`;
	const focusedIndex = useKeyboardNav(
		listRef,
		panelOpen,
		sortedNotes,
		keyboardNavResetKey,
	);

	const { copied: headerCopied, copy: copyToClipboard } = useClipboardCopy({
		resetAfterMs: 2000,
		onSuccess: () => {
			toast.success("Copied all comments as Markdown");
			announce("Comments copied as Markdown");
		},
	});

	const unresolvedNotes = deployNotes.filter((n) => !n.resolved);

	useHotkey(
		{
			key: "Escape",
			enabled: panelOpen && !popoverOpen,
			preventDefault: true,
		},
		() => {
			togglePanel();
			const button = document.querySelector<HTMLElement>("[data-panel-toggle]");
			button?.focus();
		},
	);

	const fixPrompt = useMemo(() => {
		if (unresolvedNotes.length === 0) return "";
		return `Fix these UI review issues:\n\n${unresolvedNotes
			.map((note, i) => `${i + 1}. ${formatCommentMarkdown(note)}`)
			.join("\n\n")}`;
	}, [unresolvedNotes]);

	const handleCopyAllMarkdown = () => {
		if (!fixPrompt) return;
		void copyToClipboard(fixPrompt);
	};

	const isFilteredEmpty = filteredNotes.length === 0 && deployNotes.length > 0;
	const isLeft = toolbarSide === "left";
	const panelEdgeOffset =
		TOOLBAR_EDGE_MARGIN + toolbarWidth + PANEL_TOOLBAR_GAP;
	const {
		elementRef,
		positionStyle,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		handlePointerCancel,
	} = useDockedFloatingPosition({
		side: toolbarSide,
		y: toolbarY,
		sideOffset: panelEdgeOffset,
		defaultTop: PANEL_VIEWPORT_MARGIN,
		onSideChange: setToolbarSide,
		onYChange: setToolbarY,
		canStartDrag: (target) =>
			Boolean(target.closest("[data-panel-drag-handle]")) &&
			!target.closest("button"),
	});

	// Stagger index across all sections
	let itemIndex = 0;

	return (
		<div
			ref={elementRef}
			data-side-panel
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerCancel}
			className={`fixed z-10002 ${
				panelOpen ? "" : "pointer-events-none"
			}`}
			style={{
				...positionStyle,
				top:
					typeof positionStyle.top === "number"
						? clampPanelTop(positionStyle.top)
						: positionStyle.top,
				width: PANEL_WIDTH,
			}}
		>
			<aside
				aria-label="Review feedback"
				className="ui-glass-panel flex w-full flex-col rounded-2xl"
				style={{
					backgroundColor: "rgb(255 255 255)",
					height: `calc(100vh - ${PANEL_VIEWPORT_MARGIN * 2 + PANEL_HEIGHT_OFFSET}px)`,
					opacity: panelOpen ? 1 : 0,
					transformOrigin: isLeft ? "left center" : "right center",
					transform: panelOpen ? "scale(1)" : "scale(0.985)",
					willChange: "transform, opacity",
					transition: `transform ${panelOpen ? "220ms" : "140ms"} cubic-bezier(0.23, 1, 0.32, 1), opacity ${
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

				<div
					data-panel-drag-handle
					className="ui-glass-panel-header cursor-grab active:cursor-grabbing"
				>
					{/* ── Header ─────────────────────────────────────── */}
					<div className="flex items-center justify-between px-5 pt-5 pb-4">
						<h2 className="text-[14px] font-semibold text-zinc-900">Review</h2>
						<div className="flex items-center gap-1">
							<FixWithMenu prompt={fixPrompt} />
							<button
								type="button"
								onClick={handleCopyAllMarkdown}
								className="flex size-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/55 hover:text-zinc-600"
								aria-label="Copy all comments as Markdown"
							>
								{headerCopied ? (
									<CheckIcon className="size-3.5" />
								) : (
									<CopyIcon className="size-3.5" />
								)}
							</button>
							<button
								type="button"
								onClick={togglePanel}
								className="flex size-7 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/55 hover:text-zinc-600"
								aria-label="Close review panel"
							>
								<XMarkIcon className="size-3.5" />
							</button>
						</div>
					</div>

					{/* ── Progress + Deploy ──────────────────────────── */}
					<div className="flex items-center justify-between px-5 pb-4">
						<SummaryBar stats={stats} />
						<DeployTabs />
					</div>

					{/* ── Divider ────────────────────────────────────── */}
					<div className="ui-glass-panel-separator mx-5" />
				</div>

				{/* ── Type filter ────────────────────────────────── */}
				<div className="px-5 py-3">
					<TypeFilter deployNotes={deployNotes} />
				</div>

				{/* ── Comment list ────────────────────────────────── */}
				<div
					ref={listRef}
					className="relative flex-1 overflow-y-auto px-2 pb-2"
				>
					{deployNotes.length === 0 ? (
						<EmptyState />
					) : isFilteredEmpty ? (
						<FilteredEmptyState />
					) : stats.total > 0 && stats.unresolved === 0 ? (
						<AllResolvedState total={stats.total} />
					) : (
						<div className="space-y-1">
							{sections.map((section) => {
								const sectionItems = section.notes.map((note) => {
									const idx = itemIndex++;
									const isFocused = idx === focusedIndex;
									return (
										<div
											key={note.id}
											className="animate-panel-item-in"
											style={{ "--item-index": idx } as React.CSSProperties}
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

				{/* ── Footer ─────────────────────────────────────── */}
				<div className="ui-glass-panel-separator mx-5" />
				<div className="flex items-center justify-between px-5 py-3.5">
					<span className="text-[11px] text-zinc-400">
						{unresolvedNotes.length} unresolved
						<span className="ml-2 text-zinc-300">↑↓ navigate · ↵ copy</span>
					</span>
				</div>
			</aside>
		</div>
	);
}

// ─── Empty states ───────────────────────────────────────────

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="mb-3 flex size-10 items-center justify-center rounded-full bg-zinc-50">
				<svg
					aria-hidden="true"
					className="size-5 text-zinc-300"
					fill="none"
					focusable="false"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={1.5}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
					/>
				</svg>
			</div>
			<p className="text-[13px] font-medium text-zinc-500">No feedback yet</p>
			<p className="mt-1 text-[12px] text-zinc-400">
				Share this preview to start collecting feedback.
			</p>
		</div>
	);
}

function FilteredEmptyState() {
	const { setTypeFilter } = useInspectorActions();

	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<p className="text-[13px] text-zinc-400">No comments match this filter</p>
			<button
				type="button"
				onClick={() => setTypeFilter(null)}
				className="mt-2 text-[12px] text-zinc-400 underline underline-offset-2 hover:text-zinc-600"
			>
				Clear filter
			</button>
		</div>
	);
}

function AllResolvedState({ total }: { total: number }) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="mb-3 flex size-10 items-center justify-center rounded-full bg-emerald-50">
				<CheckIcon className="size-5 text-emerald-500" />
			</div>
			<p className="text-[13px] font-medium text-zinc-500">
				All feedback addressed
			</p>
			<p className="mt-1 text-[12px] text-zinc-400">
				{total} comment{total !== 1 ? "s" : ""} resolved.
			</p>
		</div>
	);
}
