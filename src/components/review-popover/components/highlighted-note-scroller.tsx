"use client";

import { useRef } from "react";
import { useTimeout } from "@/hooks/use-timeout";
import { useUnmount } from "@/hooks/use-unmount";

export default function HighlightedNoteScroller({
	highlightedNoteId,
	listRef,
}: {
	highlightedNoteId: string;
	listRef: React.RefObject<HTMLDivElement | null>;
}) {
	const highlightedCardRef = useRef<HTMLElement | null>(null);

	useTimeout(() => {
		const card = listRef.current?.querySelector(
			`[data-note-id="${highlightedNoteId}"]`,
		);
		if (!(card instanceof HTMLElement)) {
			return;
		}

		highlightedCardRef.current = card;
		card.scrollIntoView({ behavior: "smooth", block: "center" });
		card.style.boxShadow = "0 0 0 1px var(--color-review-accent)";
	}, 250);

	useUnmount(() => {
		highlightedCardRef.current?.style.setProperty("box-shadow", "");
	});

	return null;
}
