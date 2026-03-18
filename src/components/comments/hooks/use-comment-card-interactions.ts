"use client";

import { useCallback } from "react";
import { useElementHighlightOverlay } from "@/components/inspector/hooks/use-element-highlight-overlay";
import type { NoteView } from "@/components/inspector/lib/note-view-types";
import { useInspectorActions } from "@/components/inspector/state/provider";
import { useClipboardCopy } from "@/hooks/use-clipboard-copy";
import { toast } from "@/ui/toaster";
import { formatCommentMarkdown } from "../lib/comment-format";

export function useCommentCardInteractions(note: NoteView) {
	const { setActiveNote } = useInspectorActions();
	const { showHighlight, clearHighlight } = useElementHighlightOverlay();
	const { copied, copy: copyToClipboard } = useClipboardCopy({
		onSuccess: () => toast.success("Copied as markdown"),
	});

	const handleMouseEnter = useCallback(() => {
		setActiveNote(note.id);
		void showHighlight(note.elementInfo.cssSelector, {
			variant: "preview",
		});
	}, [note.id, note.elementInfo.cssSelector, setActiveNote, showHighlight]);

	const handleMouseLeave = useCallback(() => {
		setActiveNote(null);
		clearHighlight();
	}, [clearHighlight, setActiveNote]);

	const handleCopy = useCallback(() => {
		void copyToClipboard(formatCommentMarkdown(note));
	}, [copyToClipboard, note]);

	return {
		copied,
		handleCopy,
		handleMouseEnter,
		handleMouseLeave,
	};
}
