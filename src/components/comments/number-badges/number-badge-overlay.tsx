"use client";

import { useCallback } from "react";
import { createPortal } from "react-dom";
import { useInspectorActions } from "@/components/inspector/state/provider";
import { cn } from "@/lib/utils";
import NumberBadgeHoverComment from "./hover-comment";
import type { BadgeEntry, BadgePosition } from "./types";

export default function NumberBadgeOverlay({
	entry,
	isActive,
	isMuted,
	position,
	visible,
}: {
	entry: BadgeEntry;
	isActive: boolean;
	isMuted: boolean;
	position: BadgePosition;
	visible: boolean;
}) {
	const { scrollToNote } = useInspectorActions();

	const handleClick = useCallback(() => {
		scrollToNote(entry.id);
	}, [scrollToNote, entry.id]);

	if (typeof document === "undefined") {return null;}

	return createPortal(
		<div
			data-inspector-overlay
			className={cn(
				"fixed z-9997 will-change-[transform,opacity]",
				visible
					? "scale-100 opacity-100 duration-220 ease-[cubic-bezier(0.23,1,0.32,1)]"
					: "pointer-events-none scale-[0.96] opacity-0 duration-140 ease-[cubic-bezier(0.55,0,1,0.45)]",
			)}
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
