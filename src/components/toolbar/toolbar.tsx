"use client";

import { Separator } from "@base-ui/react/separator";
import {
	useInspectorActions,
	useInspectorState,
} from "@/components/inspector/state/provider";
import { useDraggableToolbar } from "@/hooks/use-draggable-toolbar";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import InboxOutlineIcon from "@/ui/icons/inbox-outline";
import InspectIcon from "@/ui/icons/inspect";
import { Tooltip } from "@/ui/tooltip";

export default function Toolbar() {
	const { inspectMode, panelOpen, toolbarSide, toolbarY } = useInspectorState();
	const {
		toggleInspectMode,
		togglePanel,
		setToolbarSide,
		setToolbarWidth,
		setToolbarY,
	} = useInspectorActions();
	const {
		elementRef,
		positionStyle,
		handlePointerDown,
		handlePointerMove,
		handlePointerUp,
		handlePointerCancel,
	} = useDraggableToolbar(
		toolbarSide,
		toolbarY,
		setToolbarSide,
		setToolbarWidth,
		setToolbarY,
	);

	return (
		<div
			ref={elementRef}
			data-toolbar
			style={positionStyle}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerCancel}
			className="fixed z-10003 flex cursor-grab select-none items-center gap-1 rounded-full border border-primary bg-primary p-1 shadow-sm inset-border-secondary backdrop-blur active:cursor-grabbing"
		>
			<Tooltip label="Inspect elements (⌘I)">
				<Button
					size="icon"
					onClick={toggleInspectMode}
					aria-pressed={inspectMode}
					aria-label={inspectMode ? "Stop inspecting" : "Inspect elements"}
					className={cn(
						"size-8 shrink-0 overflow-hidden rounded-full! p-0",
						inspectMode
							? "ui-review-accent-bg text-white hover:opacity-95"
							: "ui-toolbar-toggle",
					)}
				>
					<InspectIcon />
				</Button>
			</Tooltip>

			<Separator
				orientation="vertical"
				className="mx-0.5 h-5 border-l border-primary"
			/>

			<Tooltip label="Review popover (⌘C)">
				<Button
					data-panel-toggle
					size="icon"
					onClick={togglePanel}
					aria-expanded={panelOpen}
					aria-label={`${panelOpen ? "Close" : "Open"} review popover`}
					className={cn(
						"relative size-8 shrink-0 overflow-hidden rounded-full! p-0",
						panelOpen ? "ui-toolbar-toggle-active" : "ui-toolbar-toggle",
					)}
				>
					<InboxOutlineIcon className="text-current size-5" />
				</Button>
			</Tooltip>
		</div>
	);
}
