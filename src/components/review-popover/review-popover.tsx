"use client";

import DrawerShell from "./components/drawer-shell";
import FloatingShell from "./components/floating-shell";
import ReviewPopoverPanel from "./components/review-popover-panel";
import { useReviewPopoverController } from "./hooks/use-review-popover-controller";
import { ReviewPopoverProvider } from "./review-popover-context";

export default function ReviewPopover() {
	const { actions, data, layout } = useReviewPopoverController();
	const Shell = layout.isDrawerMode ? DrawerShell : FloatingShell;

	return (
		<ReviewPopoverProvider actions={actions} data={data} layout={layout}>
			<Shell>
				<ReviewPopoverPanel />
			</Shell>
		</ReviewPopoverProvider>
	);
}
