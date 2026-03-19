"use client";

import { useCallback, useMemo, useRef } from "react";
import { formatCommentMarkdown } from "@/components/comments/comment-card";
import { useElementHighlightOverlay } from "@/components/inspector/hooks/use-element-highlight-overlay";
import {
	useDeployNotes,
	useFilteredNotes,
	useReviewStats,
	useSortedNotes,
} from "@/components/inspector/hooks/use-note-views";
import type { NoteView } from "@/components/inspector/lib/note-view-types";
import { isResolvedNote } from "@/components/inspector/lib/note-view-types";
import {
	useInspectorActions,
	useInspectorState,
} from "@/components/inspector/state/provider";
import {
	getPanelMode,
	isPanelOpen,
	isPopoverOpen,
} from "@/components/inspector/state/types";
import { useClipboardCopy } from "@/hooks/use-clipboard-copy";
import { useHotkey } from "@/hooks/use-hotkey";
import { toast } from "@/ui/toaster";
import { useReviewPopoverLayout } from "../hooks/use-review-popover-layout";
import { groupNotesBySeveritySection } from "../lib/review-popover-sections";
import type {
	ReviewPopoverActionsValue,
	ReviewPopoverDataValue,
	ReviewPopoverLayoutValue,
} from "../review-popover-context";
import { useReviewPopoverKeyboardNav } from "./use-review-popover-keyboard-nav";

export function useReviewPopoverController() {
	const {
		inspection,
		reviewPopover,
		drawerWidth,
		notes,
		highlightedNoteId,
		activeDeploy,
		filters,
		toolbarSide,
		toolbarWidth,
		toolbarHeight,
		toolbarY,
	} = useInspectorState();
	const {
		announce,
		clearHighlightedNote,
		setActiveNote,
		togglePanel,
		togglePanelMode,
		toggleResolve,
		setDrawerWidth,
		setDrawerResizing,
		setToolbarSide,
		setToolbarY,
	} = useInspectorActions();
	const panelOpen = isPanelOpen(reviewPopover);
	const panelMode = getPanelMode(reviewPopover);
	const popoverOpen = isPopoverOpen(inspection);
	const listRef = useRef<HTMLDivElement>(null);

	const deployNotes = useDeployNotes(notes, activeDeploy);
	const filteredNotes = useFilteredNotes(deployNotes, filters);
	const sortedNotes = useSortedNotes(filteredNotes);
	const stats = useReviewStats(deployNotes);
	const sections = useMemo(
		() => groupNotesBySeveritySection(sortedNotes),
		[sortedNotes],
	);
	const { showHighlight: showKeyboardHighlight, clearHighlight: clearKeyboardHighlight } =
		useElementHighlightOverlay();

	const onKeyboardFocusChange = useCallback(
		(note: NoteView | null) => {
			clearHighlightedNote();
			if (note) {
				setActiveNote(note.id);
				if (!note.resolved) {
					void showKeyboardHighlight(note.elementInfo.cssSelector, {
						variant: "preview",
					});
				} else {
					clearKeyboardHighlight();
				}
			} else {
				setActiveNote(null);
				clearKeyboardHighlight();
			}
		},
		[clearHighlightedNote, setActiveNote, showKeyboardHighlight, clearKeyboardHighlight],
	);

	const keyboardNavResetKey = `${activeDeploy}:${filters.type ?? "all"}`;
	const focusedIndex = useReviewPopoverKeyboardNav(
		listRef,
		panelOpen,
		sortedNotes,
		keyboardNavResetKey,
		onKeyboardFocusChange,
	);

	const closePanel = useCallback(() => {
		onKeyboardFocusChange(null);
		togglePanel();
	}, [onKeyboardFocusChange, togglePanel]);

	const { copied: headerCopied, copy: copyToClipboard } = useClipboardCopy({
		resetAfterMs: 2000,
		onSuccess: () => {
			toast.success("Copied all comments as markdown");
			announce("Comments copied as markdown");
		},
	});

	const unresolvedNotes = deployNotes.filter((note) => !isResolvedNote(note));
	const isFilteredEmpty = filteredNotes.length === 0 && deployNotes.length > 0;

	useHotkey(
		{
			key: "Escape",
			enabled: panelOpen && !popoverOpen,
			preventDefault: true,
		},
		() => {
			closePanel();
			const button = document.querySelector<HTMLElement>("[data-panel-toggle]");
			button?.focus();
		},
	);

	const fixPrompt = useMemo(() => {
		if (unresolvedNotes.length === 0) {
			return "";
		}
		return `Fix these UI review issues:\n\n${unresolvedNotes
			.map((note, index) => `${index + 1}. ${formatCommentMarkdown(note)}`)
			.join("\n\n")}`;
	}, [unresolvedNotes]);

	const {
		drawer,
		edgeMargin,
		elementRef,
		floating,
		handlePointerCancel,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		isDrawerMode,
		isLeft,
		positionStyle,
	} = useReviewPopoverLayout({
		panelMode,
		setToolbarSide,
		setToolbarY,
		toolbarHeight,
		toolbarSide,
		toolbarWidth,
		toolbarY,
	});

	const copyAll = useCallback(() => {
		if (!fixPrompt) {
			return;
		}
		void copyToClipboard(fixPrompt);
	}, [copyToClipboard, fixPrompt]);

	const actions = useMemo<ReviewPopoverActionsValue>(
		() => ({
			close: closePanel,
			copyAll,
			toggleMode: togglePanelMode,
			toggleResolve,
		}),

		[
			closePanel,
			copyAll,
			togglePanelMode,
			toggleResolve,
		],
	);

	const data = useMemo<ReviewPopoverDataValue>(
		() => ({
			deployNotes,
			fixPrompt,
			focusedIndex,
			headerCopied,
			highlightedNoteId,
			isFilteredEmpty,
			listRef,
			sections,
			stats,
			unresolvedCount: unresolvedNotes.length,
		}),
		[
			deployNotes,
			fixPrompt,
			focusedIndex,
			headerCopied,
			highlightedNoteId,
			isFilteredEmpty,
			sections,
			stats,
			unresolvedNotes.length,
		],
	);

	const layout = useMemo<ReviewPopoverLayoutValue>(
		() => ({
			drawerDefaultWidth: drawer.defaultWidth,
			drawerMaxWidth: drawer.maxWidth,
			drawerMinWidth: drawer.minWidth,
			drawerWidth,
			edgeMargin,
			elementRef,
			floatingHeight: floating.height,
			floatingPositionStyle: positionStyle,
			floatingTop: floating.top,
			floatingTransition:
				positionStyle.transition && positionStyle.transition !== "none"
					? positionStyle.transition
					: floating.followTransition,
			floatingWidth: floating.width,
			isDragging: positionStyle.cursor === "grabbing",
			isDrawerMode,
			isLeft,
			panelOpen,
			onDrawerResize: (_event, _direction, resizedElement) => {
				setDrawerWidth(resizedElement.getBoundingClientRect().width);
			},
			onDrawerResizeStart: () => {
				setDrawerResizing(true);
			},
			onDrawerResizeStop: (_event, _direction, resizedElement) => {
				setDrawerWidth(resizedElement.getBoundingClientRect().width);
				setDrawerResizing(false);
			},
			onPointerCancel: handlePointerCancel,
			onPointerDown: handlePointerDown,
			onPointerMove: handlePointerMove,
			onPointerUp: handlePointerUp,
		}),
		[
			drawer.defaultWidth,
			drawer.maxWidth,
			drawer.minWidth,
			drawerWidth,
			edgeMargin,
			elementRef,
			floating.followTransition,
			floating.height,
			floating.top,
			floating.width,
			handlePointerCancel,
			handlePointerDown,
			handlePointerMove,
			handlePointerUp,
			isDrawerMode,
			isLeft,
			panelOpen,
			positionStyle,
			setDrawerResizing,
			setDrawerWidth,
		],
	);

	return { actions, data, layout };
}
