"use client";

import { useMemo } from "react";
import {
	useInspectorActions,
	useInspectorState,
} from "@/components/inspector/state/provider";
import {
	getPanelMode,
	isInspectMode,
	isPanelOpen,
} from "@/components/inspector/state/types";
import type { ToolbarActionsValue, ToolbarDataValue } from "../toolbar-context";
import { useToolbarLayout } from "./use-toolbar-layout";

export function useToolbarController() {
	const { inspection, reviewPopover, toolbarHeight, toolbarSide, toolbarY } =
		useInspectorState();
	const {
		setToolbarHeight,
		setToolbarSide,
		setToolbarWidth,
		setToolbarY,
		toggleInspectMode,
		togglePanel,
	} = useInspectorActions();
	const inspectMode = isInspectMode(inspection);
	const panelMode = getPanelMode(reviewPopover);
	const panelOpen = isPanelOpen(reviewPopover);
	const layout = useToolbarLayout({
		panelMode,
		panelOpen,
		setToolbarHeight,
		setToolbarSide,
		setToolbarWidth,
		setToolbarY,
		toolbarHeight,
		toolbarSide,
		toolbarY,
	});

	const data = useMemo<ToolbarDataValue>(
		() => ({
			inspectMode,
			panelOpen,
		}),
		[inspectMode, panelOpen],
	);

	const actions = useMemo<ToolbarActionsValue>(
		() => ({
			toggleInspectMode,
			togglePanel,
		}),
		[toggleInspectMode, togglePanel],
	);

	return { actions, data, layout };
}
