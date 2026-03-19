"use client";

import { useRef } from "react";
import NumberBadges from "@/components/comments/number-badges";
import DemoPage from "@/components/demo/demo-page";
import { HoverProvider } from "@/components/inspector/element-hover/hover-context";
import HoverOverlay from "@/components/inspector/element-hover/hover-overlay";
import ElementPopover from "@/components/inspector/element-popover";
import { useInspector } from "@/components/inspector/hooks/use-inspector";
import {
	InspectorProvider,
	useInspectorState,
} from "@/components/inspector/state/provider";
import {
	isDrawerPanelOpen,
	isDrawerResizing,
} from "@/components/inspector/state/types";
import ReviewPopover from "@/components/review-popover/review-popover";
import Toolbar from "@/components/toolbar/toolbar";
import { Toaster } from "@/ui/toaster";
import { TooltipProvider } from "@/ui/tooltip";

function AppContent() {
	const containerRef = useRef<HTMLDivElement>(null);
	const { drawerWidth, reviewPopover } = useInspectorState();
	useInspector(containerRef);
	const isDrawerOpen = isDrawerPanelOpen(reviewPopover);
	const isResizingDrawer = isDrawerResizing(reviewPopover);

	return (
		<div className="flex h-screen overflow-hidden bg-zinc-50">
			<div
				ref={containerRef}
				className={`relative min-w-0 flex-1 overflow-y-auto ${
					isResizingDrawer
						? ""
						: "transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
				}`}
				style={{
					width: isDrawerOpen ? `calc(100% - ${drawerWidth}px)` : undefined,
				}}
			>
				<DemoPage />
			</div>
			<HoverOverlay />
			<ElementPopover />
			<NumberBadges />
			<ReviewPopover />
			<Toolbar />
			<Toaster />
		</div>
	);
}

export default function Home() {
	return (
		<HoverProvider>
			<InspectorProvider>
				<TooltipProvider>
					<AppContent />
				</TooltipProvider>
			</InspectorProvider>
		</HoverProvider>
	);
}
