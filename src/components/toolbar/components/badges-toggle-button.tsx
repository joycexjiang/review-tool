"use client";

import { Button } from "@/ui/button";
import ChatBubbleIcon from "@/ui/icons/chat-bubble";
import { Tooltip } from "@/ui/tooltip";
import { useToolbarActions, useToolbarData } from "../toolbar-context";

export default function BadgesToggleButton() {
	const { toggleNumberBadges } = useToolbarActions();
	const { numberBadgesVisible } = useToolbarData();

	return (
		<Tooltip label="Comment badges (⌘B)">
			<Button
				size="icon"
				onClick={toggleNumberBadges}
				aria-pressed={numberBadgesVisible}
				aria-label={
					numberBadgesVisible ? "Hide comment badges" : "Show comment badges"
				}
				className={`size-8 shrink-0 overflow-hidden rounded-full! p-0 ${
					numberBadgesVisible ? "ui-toolbar-toggle-active" : "ui-toolbar-toggle"
				}`}
			>
				<ChatBubbleIcon className="size-5" />
			</Button>
		</Tooltip>
	);
}
