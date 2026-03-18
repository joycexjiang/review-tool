"use client";

import { useCallback } from "react";
import { createPortal } from "react-dom";
import { useInspectorActions } from "@/components/inspector/state/provider";
import NumberBadgeHoverComment from "./hover-comment";
import type { BadgeEntry, BadgePosition } from "./types";

export default function NumberBadgeOverlay({
	entry,
	isActive,
	isMuted,
	position,
}: {
	entry: BadgeEntry;
	isActive: boolean;
	isMuted: boolean;
	position: BadgePosition;
}) {
	const { scrollToNote } = useInspectorActions();

	const handleClick = useCallback(() => {
		scrollToNote(entry.id);
	}, [scrollToNote, entry.id]);

	if (typeof document === "undefined") return null;

	return createPortal(
		<div
			data-inspector-overlay
			className="fixed z-9997"
			style={{ top: position.top, left: position.left }}
		>
			<NumberBadgeHoverComment
				entry={entry}
				isActive={isActive}
				isMuted={isMuted}
				onBadgeClick={handleClick}
			/>
		</div>,
		document.body,
	);
}
