"use client";

import { useRef } from "react";
import DemoPage from "@/components/demo/demo-page";
import { HoverProvider } from "@/components/inspector/element-hover/hover-context";
import HoverOverlay from "@/components/inspector/element-hover/hover-overlay";
import ElementPopover from "@/components/inspector/element-popover";
import NumberBadges from "@/components/inspector/number-badges";
import { InspectorProvider } from "@/components/inspector/state/provider";
import SidePanel from "@/components/panel/side-panel";
import Toolbar from "@/components/toolbar/toolbar";
import { useInspector } from "@/hooks/use-inspector";
import { Toaster } from "@/ui/toaster";
import { TooltipProvider } from "@/ui/tooltip";

function AppContent() {
	const containerRef = useRef<HTMLDivElement>(null);
	useInspector(containerRef);

	return (
		<div className="flex h-screen overflow-hidden bg-zinc-50">
			<div ref={containerRef} className="relative flex-1 overflow-y-auto">
				<DemoPage />
			</div>
			<HoverOverlay />
			<ElementPopover />
			<NumberBadges />
			<SidePanel />
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
