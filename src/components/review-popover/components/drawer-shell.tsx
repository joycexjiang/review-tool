"use client";

import { Resizable } from "re-resizable";
import { useReviewPopoverLayoutContext } from "../review-popover-context";

const ENTER_TRANSITION =
	"transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease-out";
const EXIT_TRANSITION =
	"transform 200ms cubic-bezier(0.55, 0, 1, 0.45), opacity 140ms ease-in";

export default function DrawerShell({
	children,
}: {
	children: React.ReactNode;
}) {
	const {
		drawerDefaultWidth,
		drawerMaxWidth,
		drawerMinWidth,
		drawerWidth,
		onDrawerResize,
		onDrawerResizeStart,
		onDrawerResizeStop,
		panelOpen,
	} = useReviewPopoverLayoutContext();

	return (
		<Resizable
			data-review-popover
			className={`fixed top-0 right-0 z-10002 ${panelOpen ? "" : "pointer-events-none"}`}
			size={{ width: drawerWidth, height: "100vh" }}
			minWidth={drawerMinWidth}
			maxWidth={drawerMaxWidth}
			defaultSize={{ width: drawerDefaultWidth, height: "100vh" }}
			enable={{
				top: false,
				right: false,
				bottom: false,
				left: true,
				topRight: false,
				bottomRight: false,
				bottomLeft: false,
				topLeft: false,
			}}
			handleStyles={{
				left: {
					left: -4,
					width: 8,
					cursor: "col-resize",
					backgroundColor: "transparent",
				},
			}}
			style={{
				transition: panelOpen ? ENTER_TRANSITION : EXIT_TRANSITION,
				transform: panelOpen ? "translateX(0)" : "translateX(16px)",
				opacity: panelOpen ? 1 : 0,
			}}
			onResizeStart={onDrawerResizeStart}
			onResize={onDrawerResize}
			onResizeStop={onDrawerResizeStop}
		>
			{children}
		</Resizable>
	);
}
