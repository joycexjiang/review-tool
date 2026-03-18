"use client";

import { Button } from "@/ui/button";
import InboxOutlineIcon from "@/ui/icons/inbox-outline";
import { Tooltip } from "@/ui/tooltip";
import { useToolbarActions, useToolbarData } from "../toolbar-context";

export default function ReviewPopoverToggleButton() {
	const { togglePanel } = useToolbarActions();
	const { panelOpen } = useToolbarData();

	return (
		<Tooltip label="Review popover (⌘C)">
			<Button
				data-panel-toggle
				size="icon"
				onClick={togglePanel}
				aria-expanded={panelOpen}
				aria-label={`${panelOpen ? "Close" : "Open"} review popover`}
				className={`relative size-8 shrink-0 overflow-hidden rounded-full! p-0 ${
					panelOpen ? "ui-toolbar-toggle-active" : "ui-toolbar-toggle"
				}`}
			>
				<InboxOutlineIcon className="size-5 text-current" />
			</Button>
		</Tooltip>
	);
}
