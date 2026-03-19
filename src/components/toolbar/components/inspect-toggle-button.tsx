"use client";

import { Button } from "@/ui/button";
import InspectIcon from "@/ui/icons/inspect";
import { Tooltip } from "@/ui/tooltip";
import { useToolbarActions, useToolbarData } from "../toolbar-context";

export default function InspectToggleButton() {
	const { toggleInspectMode } = useToolbarActions();
	const { inspectMode } = useToolbarData();

	return (
		<Tooltip label="Inspect elements (⌘I)">
			<Button
				size="icon"
				onClick={toggleInspectMode}
				aria-pressed={inspectMode}
				aria-label={inspectMode ? "Stop inspecting" : "Inspect elements"}
				className={`size-8 shrink-0 overflow-hidden rounded-full! p-0 text-white enabled:hover:text-white ${
					inspectMode
						? "ui-review-accent-bg hover:opacity-95"
						: "ui-toolbar-toggle"
				}`}
			>
				<InspectIcon />
			</Button>
		</Tooltip>
	);
}
