"use client";

import { useRef } from "react";
import { useTimeout } from "@/hooks/use-timeout";
import { useUnmount } from "@/hooks/use-unmount";

export default function HighlightedNoteScroller({
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
		if (!(card instanceof HTMLElement)) {return;}

		highlightedCardRef.current = card;
		card.scrollIntoView({ behavior: "smooth", block: "center" });
		card.style.boxShadow = "0 0 0 2px var(--color-review-accent)";
	}, 250);

	useTimeout(() => {
		const card = highlightedCardRef.current;
		if (!card) {return;}

		card.style.boxShadow = "";
		highlightedCardRef.current = null;
		onClear();
	}, 1750);

	useUnmount(() => {
		highlightedCardRef.current?.style.setProperty("box-shadow", "");
	});

	return null;
}
