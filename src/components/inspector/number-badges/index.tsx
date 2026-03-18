"use client";

import { useInspectorState } from "@/components/inspector/state/provider";
import { useDeployNotes } from "@/hooks/use-filtered-notes";
import NumberBadgeOverlay from "./number-badge-overlay";
import { useNumberBadges } from "./use-number-badges";

export default function NumberBadges() {
	const { notes, activeNoteId, panelOpen, activeDeploy } =
		useInspectorState();
	const deployNotes = useDeployNotes(notes, activeDeploy);
	const { entries, positions } = useNumberBadges(deployNotes, panelOpen);
	const hasActiveNote = activeNoteId !== null;

	return (
		<>
			{entries.map((entry) => {
				const position = positions.get(entry.id);
				if (!position) return null;
				return (
					<NumberBadgeOverlay
						key={entry.id}
						entry={entry}
						isActive={activeNoteId === entry.id}
						isMuted={hasActiveNote && activeNoteId !== entry.id}
						position={position}
					/>
				);
			})}
		</>
	);
}
