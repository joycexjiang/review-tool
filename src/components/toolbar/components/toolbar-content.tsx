"use client";

import { Separator } from "@base-ui/react/separator";
import { useToolbarLayoutContext } from "../toolbar-context";
import BadgesToggleButton from "./badges-toggle-button";
import InspectToggleButton from "./inspect-toggle-button";
import ReviewPopoverToggleButton from "./review-popover-toggle-button";

export default function ToolbarContent() {
	const { toolbarSide, isDrawerOpen } = useToolbarLayoutContext();
	const isVertical =
		isDrawerOpen || toolbarSide === "left" || toolbarSide === "right";

	return (
		<>
			<InspectToggleButton />
			<Separator
				orientation={isVertical ? "horizontal" : "vertical"}
				className={
					isVertical
						? "my-0.5 w-5 border-t border-[#5a5a5a]"
						: "mx-0.5 h-5 border-l border-[#5a5a5a]"
				}
			/>
			<BadgesToggleButton />
			<ReviewPopoverToggleButton />
		</>
	);
}
