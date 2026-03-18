"use client";

import { useCallback, useState } from "react";
import { formatCommentMarkdown } from "@/components/comments/comment-card";
import type { NoteView } from "@/components/inspector/lib/note-view-types";
import { useHotkey } from "@/hooks/use-hotkey";
import { toast } from "@/ui/toaster";

export function useReviewPopoverKeyboardNav(
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
					.then(() => toast.success("Copied comment as markdown"));
			}
		},
	);

	return focusedIndex;
}
