"use client";

import { useDeployNotes } from "@/components/inspector/hooks/use-note-views";
import { useInspectorState } from "@/components/inspector/state/provider";
import { getPanelMode, isPanelOpen } from "@/components/inspector/state/types";
import NumberBadgeOverlay from "./number-badge-overlay";
import { useNumberBadges } from "./use-number-badges";

export default function NumberBadges() {
	const {
		notes,
		activeNoteId,
		reviewPopover,
		drawerWidth,
		activeDeploy,
		numberBadgesVisible,
	} = useInspectorState();
	const panelOpen = isPanelOpen(reviewPopover);
	const panelMode = getPanelMode(reviewPopover);
	const deployNotes = useDeployNotes(notes, activeDeploy);
	const { entries, positions } = useNumberBadges(
		deployNotes,
		panelOpen,
		panelMode,
		drawerWidth,
	);
	const hasActiveNote = activeNoteId !== null;

	return (
		<>
			{entries.map((entry) => {
				const position = positions.get(entry.id);
				if (!position) {
					return null;
				}
				return (
					<NumberBadgeOverlay
						key={entry.id}
						entry={entry}
						isActive={activeNoteId === entry.id}
						isMuted={hasActiveNote && activeNoteId !== entry.id}
						position={position}
						visible={numberBadgesVisible}
					/>
				);
			})}
		</>
	);
}
