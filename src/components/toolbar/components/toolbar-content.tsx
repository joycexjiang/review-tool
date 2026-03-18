"use client";

import { Separator } from "@base-ui/react/separator";
import InspectToggleButton from "./inspect-toggle-button";
import ReviewPopoverToggleButton from "./review-popover-toggle-button";

export default function ToolbarContent() {
	return (
		<>
			<InspectToggleButton />
			<Separator
				orientation="vertical"
				className="mx-0.5 h-5 border-l border-primary"
			/>
			<ReviewPopoverToggleButton />
		</>
	);
}
