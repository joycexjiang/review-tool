"use client";

import { useRef } from "react";
import DemoPage from "@/components/demo/demo-page";
import { HoverProvider } from "@/components/inspector/element-hover/hover-context";
import HoverOverlay from "@/components/inspector/element-hover/hover-overlay";
import ElementPopover from "@/components/inspector/element-popover";
import NumberBadges from "@/components/inspector/number-badges";
import { useInspectorState } from "@/components/inspector/state/provider";
import { InspectorProvider } from "@/components/inspector/state/provider";
import {
	REVIEW_POPOVER_DRAWER_OFFSET,
} from "@/components/panel/review-popover-layout";
import ReviewPopover from "@/components/panel/review-popover";
import Toolbar from "@/components/toolbar/toolbar";
import { useInspector } from "@/hooks/use-inspector";
import { Toaster } from "@/ui/toaster";
import { TooltipProvider } from "@/ui/tooltip";

function AppContent() {
	const containerRef = useRef<HTMLDivElement>(null);
	const { panelOpen, panelMode } = useInspectorState();
	useInspector(containerRef);
	const isDrawerOpen = panelOpen && panelMode === "drawer";
	const contentOffset = isDrawerOpen ? REVIEW_POPOVER_DRAWER_OFFSET : "0px";

	return (
		<div className="flex h-screen overflow-hidden bg-zinc-50">
			<div
				ref={containerRef}
				className="relative flex-1 overflow-y-auto transition-[margin-left,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
				style={{
					marginLeft: contentOffset,
					width: isDrawerOpen ? `calc(100% - ${contentOffset})` : "100%",
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
